import { NetworkSchema } from '../sys.net.schema';
import { Crdt, Pkg, R, rx, slug, t, Time, UserAgent, WebRtcEvents, WebRtcUtils } from './common';
import { Mutate } from './State.Mutate.mjs';
import { pruneDeadPeers } from './util.mjs';

/**
 * Manages keeping a WebRTC network-peer in sync with a
 * shared/synced CRDT document that all team peers are aware of.
 */
export const WebRtcController = {
  Mutate,

  /**
   * Manage the state of network peers.
   */
  listen(
    self: t.Peer,
    options: {
      state?: t.NetworkDocSharedRef;
      filedir?: t.Fs;
      dispose$?: t.Observable<any>;
      bus?: t.EventBus<any>;
      onConnectStart?: (e: t.WebRtcConnectStart) => void;
      onConnectComplete?: (e: t.WebRtcConnectComplete) => void;
    } = {},
  ) {
    const { filedir, onConnectStart, onConnectComplete } = options;
    const bus = rx.busAsType<t.WebRtcEvent>(options.bus ?? rx.bus());

    const eventsFactory = (dispose$?: t.Observable<any>) =>
      WebRtcEvents({
        instance: { bus, id: self.id },
        dispose$,
      });

    const events = eventsFactory(options.dispose$);
    const instance = events.instance.id;
    const { dispose$, dispose } = events;
    const state = options.state ?? NetworkSchema.genesis({ dispose$ }).doc;
    const syncers = new Map<string, t.WebRtcStateSyncer>();

    dispose$.subscribe(() => {
      syncers.clear();
    });

    // NB: Ferry the peer-event through the event-bus.
    self.connections$.pipe(rx.takeUntil(dispose$)).subscribe((change) => {
      bus.fire({
        type: 'sys.net.webrtc/conns:changed',
        payload: { instance, change },
      });
    });
    self.error$.pipe(rx.takeUntil(dispose$)).subscribe((error) => {
      bus.fire({
        type: 'sys.net.webrtc/error',
        payload: toWebRtcError(error),
      });
    });
    const toWebRtcError = (error: t.PeerError): t.WebRtcError => ({
      instance,
      kind: 'Peer',
      error,
    });

    /**
     * Info
     */
    events.info.req$.subscribe((e) => {
      const { tx } = e;
      const { name, version } = Pkg;

      const info: t.WebRtcInfo = {
        module: { name, version },
        peer: self,
        state,
        syncers: Array.from(syncers.entries()).map(([_, syncer]) => syncer),
      };
      bus.fire({
        type: 'sys.net.webrtc/info:res',
        payload: { tx, instance, info },
      });
    });

    const updateLocalMetadata = (state: t.NetworkDocSharedRef) => {
      const peers = state.current.network.peers ?? {};
      const localPeer = peers[self.id];
      const ua = UserAgent.current;
      if (localPeer && !R.equals(localPeer.device.userAgent, ua)) {
        state.change((d) => {
          const local = d.network.peers[self.id];
          if (local) local.device.userAgent = ua;
        });
      }
    };

    /**
     * Listen to connections.
     */
    const dataConnections = events.connections.changed.data;

    /**
     * New connections.
     */
    dataConnections.added$.subscribe(async (conn) => {
      const { local, remote } = conn.peer;

      /**
       * Setup "sync protocol" on newly added data-connections.
       */
      const dispose$ = dataConnections.removed$.pipe(
        rx.filter((e) => e.id === conn.id),
        rx.take(1),
      );

      const syncer = Crdt.Doc.sync<t.NetworkDocShared>(conn.bus(), state, {
        /**
         * TODO 🐷
         * - sync-state FS
         * - BUG: error on ".file" not found (sometime)
         */
        filedir,
        dispose$,
        syncOnStart: true,
      });

      syncers.set(conn.id, { local, remote, syncer });

      state.change((d) => {
        const { initiatedBy } = conn.metadata;
        Mutate.addPeer(d.network, self.id, local, { initiatedBy });
        Mutate.addPeer(d.network, self.id, remote, { initiatedBy });
      });

      updateLocalMetadata(state);
    });

    /**
     * Connection closed (clean up).
     */
    dataConnections.removed$.subscribe((conn) => {
      syncers.delete(conn.id);
      state.change((d) => Mutate.removePeer(d.network, conn.peer.remote));
    });

    /**
     * Close requests.
     */
    events.close.req$.subscribe((e) => {
      const { tx } = e;
      const peer = { local: self.id, remote: e.remote };
      const remote = self.connectionsByPeer.find((item) => item.peer.remote === e.remote);

      const done = (error?: string) => {
        bus.fire({
          type: 'sys.net.webrtc/close:res',
          payload: { tx, instance, peer, state: state.current.network, error },
        });
      };

      if (!remote) {
        return done(`Peer to close not found`);
      }

      remote.all.forEach((conn) => conn.dispose());
      done();
    });
    /**
     * When network peers change ensure all connections are established.
     */
    const onPeersChanged = async (state: t.NetworkDocSharedRef) => {
      const peers = state.current.network.peers ?? {};
      const remotePeers = Object.values(peers)
        .filter((item) => item.id !== self.id)
        .filter((item) => !item.error);

      /**
       * Ensure peers are connected.
       */
      const wait = Object.values(remotePeers).map(async (remote) => {
        const { tx } = remote;
        const exists = self.connections.all.some((conn) => conn.peer.remote === remote.id);
        if (!exists) await connectTo(remote.id, { tx });
      });

      await Promise.all(wait);

      /**
       * Ensure user-agent is up to date.
       */
      updateLocalMetadata(state);
    };

    /**
     * Listen to document changes.
     */
    const ids = (doc: t.NetworkDocShared) => Object.keys(doc.network.peers ?? {});
    state.$.pipe(
      rx.map((e) => e.doc),
      rx.distinctUntilChanged((prev, next) => R.equals(ids(prev), ids(next))),
    ).subscribe(() => onPeersChanged(state));

    /**
     * Establish connection.
     */
    const connectTo = async (remote: t.PeerId, options: { tx?: string } = {}) => {
      const tx = options.tx ?? slug();
      const peer = { local: self.id, remote };

      /**
       * Before.
       */
      const before: t.WebRtcConnectStart = {
        tx,
        instance,
        peer,
        state: R.clone(state.current.network),
      };
      onConnectStart?.(before);
      bus.fire({ type: 'sys.net.webrtc/connect:start', payload: before });

      /**
       * TODO 🐷
       * - camera option (for audio only)
       */

      /**
       * Connect.
       */
      let conns: t.PeerConnection[] = [];

      try {
        conns = await Promise.all([
          self.data(remote), //             <== Start (data).
          // self.media(remote, 'camera'), //  <== Start (camera).
        ]);
      } catch (err: any) {
        const error = WebRtcUtils.error.toPeerError(err);
        state.change((d) => (d.network.peers[remote].error = `[${error.type}] ${err.message}`));
      }

      /**
       * After.
       */
      const after: t.WebRtcConnectComplete = {
        tx,
        instance,
        peer,
        state: R.clone(state.current.network),
      };
      onConnectComplete?.(after);
      bus.fire({ type: 'sys.net.webrtc/connect:complete', payload: after });
    };

    /**
     * Initiate a connection via updating the shared {network} state-document.
     */
    events.connect.req$.subscribe((e) => {
      const { tx } = e;
      state.change((d) => {
        const local = self.id;
        const initiatedBy = local;
        Mutate.addPeer(d.network, local, e.remote, { initiatedBy, tx });
      });
    });

    /**
     * Prune dead peers.
     */
    events.prune.req$.subscribe(async (e) => {
      const { tx } = e;
      const res = await pruneDeadPeers(self, state);
      const removed = res.removed;
      bus.fire({
        type: 'sys.net.webrtc/prune:res',
        payload: { tx, instance, removed },
      });
    });

    /**
     * PUBLIC API.
     */
    const api: t.WebRtcController = {
      state,

      /**
       * Create a new events interface into the controller.
       */
      events() {
        return eventsFactory(dispose$);
      },

      /**
       * Lifecycle
       */
      dispose,
      dispose$,
      get disposed() {
        return _disposed;
      },
    };
    return api;
  },
};

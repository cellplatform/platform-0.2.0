import { Crdt, Pkg, R, rx, slug, t, WebRtcEvents, WebRtcUtils } from './common';
import { Mutate } from './Controller.Mutate.mjs';
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
    state: t.CrdtDocRef<t.NetworkSharedDoc>,
    options: {
      filedir?: t.Fs;
      dispose$?: t.Observable<any>;
      bus?: t.EventBus<any>;
      onConnectStart?: (e: t.WebRtcConnectStart) => void;
      onConnectComplete?: (e: t.WebRtcConnectComplete) => void;
    } = {},
  ) {
    const { filedir } = options;
    const bus = rx.busAsType<t.WebRtcEvent>(options.bus ?? rx.bus());
    const events = WebRtcEvents({ instance: { bus, id: self.id }, dispose$: options.dispose$ });
    const instance = events.instance.id;
    const dispose$ = events.dispose$;
    const syncers = new Map<string, t.WebRtcInfoSyncer>();

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
        state: R.clone(state.current.network),
        syncers: Array.from(syncers.entries()).map(([_, syncer]) => syncer),
      };
      bus.fire({
        type: 'sys.net.webrtc/info:res',
        payload: { tx, instance, info },
      });
    });

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

      const syncer = Crdt.Doc.sync<t.NetworkSharedDoc>(conn.bus(), state, {
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

      state.change((d) => {
        const localPeer = d.network.peers[self.id];

        // if (localPeer) {
        //   localPeer.meta.userAgent = UserAgent.parse(navigator.userAgent);
        // }
      });
    });

    /**
     * Connection closed (clean up).
     */
    dataConnections.removed$.subscribe((conn) => {
      syncers.delete(conn.id);
      state.change((d) => Mutate.removePeer(d.network, conn.peer.remote));
    });

    /**
     * Listen to document changes.
     */
    state.onChange(async (e) => {
      const peers = e.doc.network.peers ?? {};
      Object.values(peers)
        .filter((peer) => peer.id !== self.id) // Ignore self (not remote).
        .filter((remote) => !remote.error)
        .forEach((remote) => {
          const exists = self.connections.all.some((conn) => conn.peer.remote === remote.id);
          if (!exists) connectTo(remote.id);
        });
    });

    const connectTo = async (remote: t.PeerId) => {
      const tx = slug();
      const peer = { local: self.id, remote };
      const before: t.WebRtcConnectStart = {
        tx,
        instance,
        peer,
        state: R.clone(state.current.network),
      };
      options.onConnectStart?.(before);
      bus.fire({
        type: 'sys.net.webrtc/connect:start',
        payload: before,
      });

      /**
       * TODO 🐷
       * - camera option (for audio only)
       */

      try {
        await Promise.all([
          self.data(remote), //             <== Start (data).
          self.media(remote, 'camera'), //  <== Start (camera).
        ]);
      } catch (err: any) {
        const error = WebRtcUtils.error.toPeerError(err);
        state.change((d) => {
          const message = `[${error.type}] ${err.message}`;
          d.network.peers[remote].error = message;
        });
      }

      const after: t.WebRtcConnectComplete = {
        tx,
        instance,
        peer,
        state: R.clone(state.current.network),
      };
      options.onConnectComplete?.(after);
      bus.fire({
        type: 'sys.net.webrtc/connect:complete',
        payload: after,
      });
    };

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
    return events;
  },
};

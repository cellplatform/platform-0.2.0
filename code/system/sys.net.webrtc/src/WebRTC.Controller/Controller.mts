import { WebRtcEvents } from '../WebRtc.Events';
import { Crdt, Pkg, R, rx, slug, t, UserAgent } from './common';
import { Mutate } from './Controller.Mutate.mjs';

/**
 * TODO 🐷 MOVE to type.mts
 */
export type Doc = { network: t.NetworkState };

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
    state: t.CrdtDocRef<Doc>,
    options: {
      filedir?: t.Fs;
      dispose$?: t.Observable<any>;
      bus?: t.EventBus<any>;
      onConnectStart?: (e: { local: t.PeerId; remote: t.PeerId }) => void;
      onConnectComplete?: (e: { local: t.PeerId; remote: t.PeerId }) => void;
    } = {},
  ): t.WebRtcEvents {
    const { filedir } = options;

    const bus = rx.busAsType<t.WebRtcEvent>(options.bus ?? rx.bus());
    const events = WebRtcEvents({ instance: { bus, id: self.id }, dispose$: options.dispose$ });
    const instance = events.instance.id;
    self.connections$.pipe(rx.takeUntil(events.dispose$)).subscribe((change) => {
      bus.fire({
        // NB: Ferry the peer-event through the event-bus.
        type: 'sys.net.webrtc/conns:changed',
        payload: { instance, change },
      });
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
     * New connection.
     */
    dataConnections.added$.subscribe(async (conn) => {
      /**
       * Setup "sync protocol" on newly added data-connections.
       */
      const dispose$ = dataConnections.removed$.pipe(rx.filter((e) => e.id === conn.id));
      const syncer = Crdt.Doc.sync<Doc>(conn.bus(), state, {
        /**
         * TODO 🐷
         * - sync-state FS
         * - BUG: error on ".file" not found (sometime)
         */
        filedir,
        dispose$,
        syncOnStart: true,
      });

      state.change((d) => {
        // initiatedBy
        const { local, remote } = conn.peer;
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
    dataConnections.removed$.subscribe((e) => {
      state.change((d) => Mutate.removePeer(d.network, e.peer.remote));
    });

    /**
     * Listen to document changes.
     */
    state.onChange(async (e) => {
      const processChange = async (remote: t.NetworkStatePeer) => {
        if (remote.id === self.id) return; // Ignore self.
        const isInitiatedByMe = remote.initiatedBy === self.id;
        const exists = self.connections.all.some((conn) => conn.peer.remote === remote.id);

        if (!exists && isInitiatedByMe) {
          const tx = slug();
          const peer = { local: self.id, remote: remote.id };
          const before = R.clone(state.current.network);
          bus.fire({
            type: 'sys.net.webrtc/connect:start',
            payload: { tx, instance, peer, state: before },
          });

          options.onConnectStart?.(peer);

          /**
           * TODO 🐷
           * - spinner (start/end)
           * - camera option (for audio only)
           */

          await Promise.all([
            self.data(remote.id), //             <== Start (data).
            self.media(remote.id, 'camera'), //  <== Start (camera).
          ]);

          options.onConnectComplete?.(peer);
          const after = R.clone(state.current.network);
          bus.fire({
            type: 'sys.net.webrtc/connect:complete',
            payload: { tx, instance, peer, state: after },
          });
        }
      };

      const peers = e.doc.network.peers ?? {};
      Object.values(peers).forEach((peer) => processChange(peer));
    });

    /**
     * PUBLIC API.
     */
    return events;
  },
};

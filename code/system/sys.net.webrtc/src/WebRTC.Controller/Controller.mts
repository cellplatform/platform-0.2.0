import { Crdt, rx, t } from './common';
import { Mutate } from './Controller.Mutate.mjs';
import { WebRtcUtil } from '../WebRtc.Util';

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
  listen(args: {
    self: t.Peer;
    state: t.CrdtDocRef<Doc>;
    filedir?: t.Fs;
    dispose$?: t.Observable<any>;
    onConnectStart?: (e: { local: t.PeerId; remote: t.PeerId }) => void;
    onConnectComplete?: (e: { local: t.PeerId; remote: t.PeerId }) => void;
  }) {
    const { self, state, filedir } = args;

    /**
     * Listen to connections.
     */
    const changed = WebRtcUtil.connections.changed(self, args.dispose$);
    const connAdded$ = changed.data.added$;
    const connRemoved$ = changed.data.removed$;

    /**
     * New connection.
     */
    connAdded$.subscribe(async (conn) => {
      /**
       * Setup "sync protocol" on newly added data-connections.
       */
      const dispose$ = connRemoved$.pipe(rx.filter((e) => e.id === conn.id));
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
        const { local, remote } = conn.peer;
        Mutate.addPeer(d.network, self.id, local);
        Mutate.addPeer(d.network, self.id, remote);
      });

      state.change((d) => {
        const localPeer = d.network.peers[self.id];

        console.log('localPeer >>> ||||||||||||', localPeer);

        // localPeer.initiatedBy
        console.log('navigator.userAgent', navigator.userAgent);

        localPeer.meta.useragent = navigator.userAgent;
      });
    });

    /**
     * Connection closed (clean up).
     */
    connRemoved$.subscribe((e) => {
      state.change((d) => {
        Mutate.removePeer(d.network, e.peer.remote);
      });
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
          args.onConnectStart?.({ local: self.id, remote: remote.id });

          /**
           * TODO 🐷
           * - spinner (start/end)
           * - camera option (for audio only)
           */

          await Promise.all([
            self.data(remote.id), //             <== Start (data).
            self.media(remote.id, 'camera'), //  <== Start (camera).
          ]);

          args.onConnectComplete?.({ local: self.id, remote: remote.id });
        }
      };

      const peers = e.doc.network.peers ?? {};
      Object.values(peers).forEach((peer) => processChange(peer));
    });
  },
};

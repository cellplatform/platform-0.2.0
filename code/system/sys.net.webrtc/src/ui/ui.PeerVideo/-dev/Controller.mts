import { Time, WebRTC, t, rx, Crdt } from '../../common';
import { List } from '@automerge/automerge';

export type NetworkState = {
  peers: t.PeerId[];
};

type Doc = { network: NetworkState };

/**
 * Manages keeping a
 */
export const Controller = {
  /**
   * Helpers for mutating the state.
   * IMPORTANT:
   *    Only pass the state from within an immutable CRDT 'change' handler.
   */
  mutate: {
    addPeer(data: NetworkState, remotePeer: t.PeerId) {
      const peers = data.peers ?? (data.peers = []);
      if (!peers.includes(remotePeer)) peers.push(remotePeer);
    },

    removePeer(data: NetworkState, remotePeer: t.PeerId) {
      //
      /**
       * TODO 🐷
       */
    },
  },

  /**
   * Manage the state of network peers.
   */
  listen(args: {
    self: t.Peer;
    state: t.CrdtDocRef<Doc>;
    filedir?: t.Fs;
    dispose$?: t.Observable<any>;
  }) {
    const { self, state, filedir } = args;

    /**
     * Listen to connections.
     */
    const changed = WebRTC.Util.connections.changed(self, args.dispose$);
    const added$ = changed.data.added$;
    const removed$ = changed.data.removed$;

    /**
     * Setup "sync protocol" on newly added data-connections.
     */
    added$.subscribe((conn) => {
      const dispose$ = removed$.pipe(rx.filter((e) => e.id === conn.id));
      Crdt.Doc.sync<Doc>(conn.bus(), state, { filedir, dispose$ });
      state.change((d) => {
        Controller.mutate.addPeer(d.network, conn.peer.remote);
        Controller.mutate.addPeer(d.network, conn.peer.local);
      });
    });

    removed$.subscribe((e) => {
      //
      state.change((d) => {
        // e.id
        console.log('removed', e);

        const list = d.network.peers as List<t.PeerId>;
        // const index = list.findIndex((id) => id === e.peer.remote);
        // console.log('delete', index, list);
        // if (index > -1) list.deleteAt(index);

        // TODO 🐷
        // Controller.mutate.removePeer(d.network, e.peer.remote);
      });
    });

    /**
     * Listen to document changes.
     */
    state.onChange(async (e) => {
      await Time.wait(500); // HACK: Wait for CRDT to settle so as not to add connections.

      const peers = e.doc.network.peers ?? [];

      peers.forEach(async (remoteId) => {
        const exists = self.connections.all.some((conn) => conn.peer.remote === remoteId);

        if (!exists) {
          await Promise.all([
            // self.data(remoteId), //             <== Start (data).
            // self.media(remoteId, 'camera'), //  <== Start (camera).
          ]);
        }
      });
    });
  },
};

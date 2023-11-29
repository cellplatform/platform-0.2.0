import { Crdt, Doc, rx, type t } from './common';

import { WebrtcNetworkAdapter } from './NetworkAdapter';
import { handshake } from './Store.Ephemeral.handshake';
import { IndexSync } from './Store.IndexSync';
import { monitorAdapter } from './u.adapter';
import { Patches } from './Store.Ephemeral.patches';

/**
 * A non-persistent store manager for sharing ephemeral
 * data over the network connection.
 */
export const Ephemeral = {
  Patches,

  /**
   * Setup a new ephemeral document manager for a store/peer.
   */
  async init(
    peer: t.PeerModel,
    store: t.Store,
    index: t.StoreIndex,
    fire?: (e: t.WebrtcStoreMessageEvent) => void,
  ) {
    const life = rx.lifecycle([peer.dispose$, store.dispose$]);
    const { dispose$ } = life;
    const self = peer.id;

    const doc = await store.doc.getOrCreate<t.WebrtcEphemeral>((d) => {
      Doc.Meta.ensure(d, { ...Doc.Meta.default, ephemeral: true });
      d.shared = {};
    });
    IndexSync.local(index, doc, dispose$);

    /**
     * API
     */
    return {
      store,
      index,
      doc,

      /**
       * Connection handshake that setups up the link to the remote ephemeral doc.
       */
      async connect(conn: t.DataConnection) {
        const dispose$ = [peer.dispose$, store.dispose$];

        // Setup the network adapter.
        const adapter = new WebrtcNetworkAdapter(conn);
        monitorAdapter({ adapter, fire, dispose$ });

        // Perform ephemeral document URI handshake.
        const res = await handshake({ conn, peer, doc, dispose$ });
        const remote = await store.doc.get<t.WebrtcEphemeral>(res.doc.uri);
        if (remote) IndexSync.remote(index, remote, dispose$);
      },

      /**
       * Lifecycle
       */
      dispose$,
      get disposed() {
        return life.disposed;
      },
    } as const;
  },

  /**
   * Remove all ephemeral documents from the given repo index.
   */
  purge(index: t.StoreIndex) {
    index.doc.change((d) => {
      const docs = Crdt.Data.array(d.docs);
      let index = -1;
      while (true) {
        index = d.docs.findIndex((item) => item.meta?.ephemeral);
        if (index < 0) break;
        docs.deleteAt(index);
      }
    });
  },
} as const;

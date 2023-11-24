import { WebrtcNetworkAdapter } from './Webrtc.NetworkAdapter';
import { Doc, type t } from './common';
import { monitorAdapter } from './u.adapter';

/**
 * A non-persistent store manager for sharing ephemeral
 * data over the network connection.
 */

export const Ephemeral = {
  init(
    peer: t.PeerModel,
    store: t.Store,
    index: t.StoreIndex,
    fire?: (e: t.WebrtcStoreMessageEvent) => void,
  ) {
    const generator = store.doc.factory<t.DocWithMeta>((d) => {
      const defaults = Doc.Meta.default;
      Doc.Meta.ensure(d, { ...defaults, ephemeral: true });
    });

    /**
     * API
     */
    return {
      store,
      index,
      async connect(conn: t.DataConnection) {
        const dispose$ = [peer.dispose$, store.dispose$];
        const local = peer.id;
        const remote = conn.peer;
        const adapter = new WebrtcNetworkAdapter(conn);
        monitorAdapter({ adapter, fire, dispose$ });
        // console.log('-------------------------------------------');
      },
    } as const;
  },
} as const;

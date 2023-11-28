import { WebrtcNetworkAdapter } from './Webrtc.NetworkAdapter';
import { rx, Doc, type t } from './common';
import { monitorAdapter } from './u.adapter';
import { handshake } from './Webrtc.Store.Ephemeral.handshake';

/**
 * A non-persistent store manager for sharing ephemeral
 * data over the network connection.
 */

export const Ephemeral = {
  async init(
    peer: t.PeerModel,
    store: t.Store,
    index: t.StoreIndex,
    fire?: (e: t.WebrtcStoreMessageEvent) => void,
  ) {
    const life = rx.lifecycle([peer.dispose$, store.dispose$]);
    const { dispose$ } = life;
    const peerEvents = peer.events(dispose$);
    const data$ = peerEvents.cmd.data$.pipe(rx.map((e) => e.data));

    const doc = await store.doc.getOrCreate<t.WebrtcEphemeral>((d) => {
      const defaults = Doc.Meta.default;
      Doc.Meta.ensure(d, { ...defaults, ephemeral: true });
    });

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
        const rdoc = await store.doc.get(res.doc.uri);
        rdoc?.events().changed$.subscribe((e) => {
          console.log(' >> ', res.peer.local, rdoc.current);
        });
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
} as const;

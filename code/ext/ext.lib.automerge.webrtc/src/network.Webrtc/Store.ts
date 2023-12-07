import { rx, type t } from './common';

import { WebrtcNetworkAdapter } from './NetworkAdapter';
import { SyncDoc } from './Store.SyncDoc';
import { monitorAdapter } from './u.adapter';

/**
 * Manages the relationship between a [Repo/Store] and a network peer.
 */
export const WebrtcStore = {
  SyncDoc,

  /**
   * Initialize a new network manager.
   */
  async init(
    peer: t.PeerModel,
    store: t.Store,
    index: t.StoreIndex,
    options: { label?: string } = {},
  ) {
    const { label } = options;
    const life = rx.lifecycle([peer.dispose$, store.dispose$]);
    const { dispose, dispose$ } = life;
    const peerEvents = peer.events(dispose$);
    const total = { added: 0, bytes: { in: 0, out: 0 } };

    const subject$ = rx.subject<t.WebrtcStoreEvent>();
    const $ = subject$.pipe(rx.takeUntil(dispose$));
    const added$ = rx.payload<t.WebrtcStoreAdapterAddedEvent>($, 'crdt:webrtc/AdapterAdded');
    const message$ = rx.payload<t.WebrtcStoreMessageEvent>($, 'crdt:webrtc/Message');

    const fire = (e: t.WebrtcStoreEvent) => subject$.next(e);
    const syncdoc = await SyncDoc.init(peer, store, index, { fire, label });

    const ready$ = peerEvents.cmd.conn$.pipe(
      rx.filter((e) => e.kind === 'data'),
      rx.filter((e) => e.action === 'ready'),
      rx.map((e) => e.connection?.id ?? ''),
      rx.filter(Boolean),
    );

    message$.subscribe((e) => {
      if (e.message.type === 'sync') {
        const bytes = e.message.data.byteLength;
        if (e.direction === 'Incoming') total.bytes.in += bytes;
        if (e.direction === 'Outgoing') total.bytes.out += bytes;
      }
    });

    const initializeAdapter = async (connid: string) => {
      const conn = peer.get.conn.obj.data(connid);
      if (!conn) throw new Error(`Failed to retrieve WebRTC data-connection with id "${connid}".`);

      const adapter = new WebrtcNetworkAdapter(conn);
      store.repo.networkSubsystem.addNetworkAdapter(adapter);
      total.added += 1;
      monitorAdapter({ adapter, fire, dispose$ });

      fire({
        type: 'crdt:webrtc/AdapterAdded',
        payload: { peer: peer.id, conn: { id: connid, obj: conn }, adapter },
      });

      await syncdoc.connect(conn);
    };

    /**
     * API
     */
    const api: t.WebrtcStore = {
      peer,
      store,
      index,
      syncdoc: syncdoc.doc.local,

      $,
      added$,
      message$,

      get total() {
        return total;
      },

      /**
       * Lifecycle
       */
      dispose,
      dispose$,
      get disposed() {
        return life.disposed;
      },
    } as const;

    /**
     * Finish up.
     */
    ready$.subscribe((connid) => initializeAdapter(connid));
    return api;
  },
} as const;

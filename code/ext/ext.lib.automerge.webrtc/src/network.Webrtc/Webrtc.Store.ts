import { rx, type t } from './common';
import { WebrtcNetworkAdapter } from './Webrtc.NetworkAdapter';

/**
 * Manages the relationship between a [Repo/Store] and a network peer.
 */
export const WebrtcStore = {
  init(peer: t.PeerModel, store: t.Store) {
    const life = rx.lifecycle([peer.dispose$, store.dispose$]);
    const { dispose, dispose$ } = life;

    const subject$ = rx.subject<t.WebrtcStoreEvent>();
    const $ = subject$.pipe(rx.takeUntil(dispose$));
    const fire = (e: t.WebrtcStoreEvent) => subject$.next(e);

    const total = { added: 0, bytes: 0 };

    const peerEvents = peer.events(dispose$);
    const ready$ = peerEvents.cmd.conn$.pipe(
      rx.filter((e) => e.kind === 'data'),
      rx.filter((e) => e.action === 'ready'),
      rx.map((e) => e.connection?.id ?? ''),
      rx.filter(Boolean),
    );

    ready$.subscribe((id) => {
      const obj = peer.get.conn.obj.data(id);
      if (!obj) throw new Error(`Failed to retrieve data connection with id "${id}".`);

      const adapter = new WebrtcNetworkAdapter(obj);
      store.repo.networkSubsystem.addNetworkAdapter(adapter);

      adapter.$.pipe(rx.takeUntil(dispose$)).subscribe((e) => {
        if (e.type === 'sync') total.bytes += e.data.byteLength;
        fire({ type: 'crdt:webrtc/Message', payload: e });
      });

      total.added += 1;
      fire({
        type: 'crdt:webrtc/AdapterAdded',
        payload: { peer: peer.id, conn: { id, obj }, adapter },
      });
    });

    const api: t.WebrtcStore = {
      store,
      peer,

      $,
      add$: rx.payload<t.WebrtcStoreAdapterAddedEvent>($, 'crdt:webrtc/AdapterAdded'),
      message$: rx.payload<t.WebrtcStoreMessageEvent>($, 'crdt:webrtc/Message'),

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

    return api;
  },
} as const;

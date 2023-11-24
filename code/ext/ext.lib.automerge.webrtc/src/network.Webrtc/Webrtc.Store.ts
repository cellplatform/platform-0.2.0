import { rx, type t } from './common';
import { WebrtcNetworkAdapter } from './Webrtc.NetworkAdapter';

/**
 * Manages the relationship between a [Repo/Store] and a network peer.
 */
export const WebrtcStore = {
  init(peer: t.PeerModel, store: t.Store) {
    const life = rx.lifecycle([peer.dispose$, store.dispose$]);
    const { dispose, dispose$ } = life;
    const peerEvents = peer.events(dispose$);
    const total = { added: 0, bytes: { in: 0, out: 0 } };

    const subject$ = rx.subject<t.WebrtcStoreEvent>();
    const $ = subject$.pipe(rx.takeUntil(dispose$));
    const added$ = rx.payload<t.WebrtcStoreAdapterAddedEvent>($, 'crdt:webrtc/AdapterAdded');
    const message$ = rx.payload<t.WebrtcStoreMessageEvent>($, 'crdt:webrtc/Message');

    const fire = (e: t.WebrtcStoreEvent) => subject$.next(e);

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

      const adapter = new WebrtcNetworkAdapter(obj);
      store.repo.networkSubsystem.addNetworkAdapter(adapter);

      adapter.message$.pipe(rx.takeUntil(dispose$)).subscribe((e) => {
        if (e.message.type === 'sync') total.bytes += e.message.data.byteLength;
        fire({ type: 'crdt:webrtc/Message', payload: e });
      });

      total.added += 1;
      fire({
        type: 'crdt:webrtc/AdapterAdded',
        payload: { peer: peer.id, conn: { id: connid, obj }, adapter },
      });
    };

    /**
     * API
     */
    const api: t.WebrtcStore = {
      store,
      peer,

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
    ready$.subscribe(initializeNetworkAdapter);
    return api;
  },
} as const;

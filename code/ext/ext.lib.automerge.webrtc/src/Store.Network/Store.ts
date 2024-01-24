import { Shared } from './Shared';
import { eventsFactory } from './Store.Events';
import { WebrtcNetworkAdapter, rx, type t } from './common';
import { monitorAdapter } from './u.adapter';

/**
 * Manages the relationship between a [Repo/Store] and a network peer.
 */
export const WebrtcStore = {
  Shared,

  /**
   * Initialize a new network manager.
   */
  async init(
    peer: t.PeerModel,
    store: t.Store,
    index: t.StoreIndexState,
    options: { debugLabel?: string } = {},
  ): Promise<t.NetworkStore> {
    const { debugLabel } = options;
    const life = rx.lifecycle([peer.dispose$, store.dispose$]);
    const { dispose, dispose$ } = life;
    const total = { added: 0, bytes: { in: 0, out: 0 } };

    const $$ = rx.subject<t.WebrtcStoreEvent>();
    const $ = $$.pipe(rx.takeUntil(dispose$));
    const fire = (e: t.WebrtcStoreEvent) => $$.next(e);

    let _shared: t.CrdtSharedState | undefined;
    const initShared = async (uri?: string) => {
      if (_shared) return;
      _shared = await Shared.init({ $, peer, store, index, uri, debugLabel, fire });
      fire({
        type: 'crdt:webrtc:shared/Ready',
        payload: _shared,
      });
    };

    /**
     * Initialize a network adapter for the given connection ID.
     */
    const initAdapter = async (connid: string, direction: t.IODirection) => {
      const conn = peer.get.conn.obj.data(connid);
      if (!conn) throw new Error(`Failed to retrieve WebRTC data-connection with id "${connid}".`);

      /**
       * Lifecycle
       */
      const { dispose$, dispose } = rx.disposable([peer.dispose$, store.dispose$]);
      dispose$.subscribe(() => adapter.disconnect());
      conn.on('close', dispose);

      /**
       * Network adapter.
       */
      const adapter = new WebrtcNetworkAdapter(conn);
      store.repo.networkSubsystem.addNetworkAdapter(adapter);
      monitorAdapter({ adapter, fire, dispose$ });
      total.added += 1;
      fire({
        type: 'crdt:webrtc/AdapterAdded',
        payload: {
          peer: { local: peer.id, remote: conn.peer },
          conn: { id: connid },
        },
      });

      /**
       * Setup shared-doc.
       */
      if (direction === 'incoming') {
        const metadata = conn.metadata as t.NetworkStoreConnectMetadata;
        if (metadata.shared) {
          const uri = metadata.shared;
          await initShared(uri);
        }
      }
    };

    /**
     * API
     */
    const api: t.NetworkStore = {
      peer,
      store,
      index,

      get total() {
        return total;
      },

      events(dispose$) {
        return eventsFactory({ $, store, peer, dispose$: [dispose$, api.dispose$] });
      },

      async shared() {
        if (_shared) return _shared;
        return rx.firstValueFrom(events.shared.ready$.pipe(rx.take(1)));
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
     * Listen
     */
    const events = api.events();

    /**
     * - Monitor sync messages.
     */
    events.message$.subscribe((e) => {
      if (e.message.type === 'sync') {
        const bytes = e.message.data?.byteLength ?? 0;
        if (e.direction === 'incoming') total.bytes.in += bytes;
        if (e.direction === 'outgoing') total.bytes.out += bytes;
      }
    });

    /**
     * - Network peer setup (when Peer becomes "ready").
     */
    events.peer.cmd.conn$
      .pipe(
        rx.filter((e) => e.kind === 'data'),
        rx.filter((e) => e.action === 'ready'),
        rx.filter((e) => Boolean(e.connection?.id && e.direction)),
        rx.map((e) => ({ connid: e.connection?.id!, direction: e.direction! })),
      )
      .subscribe((e) => initAdapter(e.connid, e.direction));

    /**
     * [Shared] network document setup.
     *    Catch before an outbound connection starts and publish
     *    the store's URI to it's [Shared] state document.
     */
    events.peer.cmd.beforeOutgoing$.subscribe((e) => {
      e.metadata<t.NetworkStoreConnectMetadata>(async (metadata) => {
        if (!_shared) await initShared();
        metadata.shared = _shared!.doc.uri;
      });
    });

    /**
     * Finish up.
     */
    return api;
  },
} as const;

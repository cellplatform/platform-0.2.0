import { rx, type t } from './common';

import { WebrtcNetworkAdapter } from './NetworkAdapter';
import { Shared } from './Shared';
import { eventsFactory } from './Store.Events';
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
  ): Promise<t.WebrtcStore> {
    const { debugLabel } = options;
    const life = rx.lifecycle([peer.dispose$, store.dispose$]);
    const { dispose, dispose$ } = life;
    const total = { added: 0, bytes: { in: 0, out: 0 } };

    /**
     * TODO 🐷 shared events sub-sumed witin the Store events (??)
     */
    const fire = (e: t.WebrtcStoreEvent) => $$.next(e);
    const $$ = rx.subject<t.WebrtcStoreEvent>();
    const $ = $$.pipe(rx.takeUntil(dispose$));
    const shared$ = rx.payload<t.CrdtSharedChangedEvent>($, 'crdt:webrtc:shared/Changed');

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
        const metadata = conn.metadata as t.WebrtcStoreConnectMetadata;
        if (metadata.shared) {
          const uri = metadata.shared;
          await initShared(uri);
        }
      }
    };

    /**
     * API
     */
    const api: t.WebrtcStore = {
      peer,
      store,
      index,

      get total() {
        return total;
      },

      shared: {
        $: shared$,
        get doc() {
          return _shared?.doc;
        },
        namespace<N extends string = string>() {
          return _shared ? Shared.namespace<N>(_shared.doc) : undefined;
        },
      },

      events(dispose$) {
        return eventsFactory({ $, store, peer, dispose$: [dispose$, api.dispose$] });
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
        const bytes = e.message.data.byteLength;
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
      e.metadata<t.WebrtcStoreConnectMetadata>(async (metadata) => {
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

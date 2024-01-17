import { rx, type t } from './common';

import { WebrtcNetworkAdapter } from './NetworkAdapter';
import { Shared } from './Shared';
import { monitorAdapter } from './u.adapter';
import { eventsFactory } from './Store.Events';

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
    const peerEvents = peer.events(dispose$);
    const total = { added: 0, bytes: { in: 0, out: 0 } };

    const fire = (e: t.WebrtcStoreEvent) => $$.next(e);

    /**
     * TODO 🐷 shared events sub-sumed witin the Store events (??)
     */
    const $$ = rx.subject<t.WebrtcStoreEvent>();
    const $ = $$.pipe(rx.takeUntil(dispose$));
    const shared$ = rx.payload<t.CrdtSharedChangedEvent>($, 'crdt:shared/Changed');

    /**
     * [Shared] network document setup.
     * Catch before an outbound connection starts and publish the store URI to the document.
     */
    let shared: t.CrdtSharedState | undefined;
    peerEvents.cmd.beforeOutgoing$.subscribe((e) => {
      e.metadata<t.WebrtcStoreConnectMetadata>(async (data) => {
        if (!shared) shared = await Shared.init(peer, store, index, { debugLabel, fire });
        data.shared = shared.doc.uri;
      });
    });

    /**
     * Network peer setup.
     */
    const peerReady$ = peerEvents.cmd.conn$.pipe(
      rx.filter((e) => e.kind === 'data'),
      rx.filter((e) => e.action === 'ready'),
      rx.filter((e) => Boolean(e.connection?.id && e.direction)),
      rx.map((e) => ({ connid: e.connection?.id!, direction: e.direction! })),
    );

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
          shared = await Shared.init(peer, store, index, { uri, debugLabel, fire });
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
          return shared?.doc;
        },
        namespace<N extends string = string>() {
          return shared ? Shared.namespace<N>(shared.doc) : undefined;
        },
      },

      events(dispose$) {
        return eventsFactory(api, $, { dispose$: [dispose$, api.dispose$] });
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
    peerReady$.subscribe((e) => initAdapter(e.connid, e.direction));

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
     * Finish up.
     */
    return api;
  },
} as const;

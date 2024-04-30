import { Shared } from './Shared';
import { eventsFactory } from './Store.Events';
import { Doc, Log, PeerjsNetworkAdapter, rx, toObject, type t } from './common';
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
    options: { debugLabel?: string; logLevel?: t.LogLevel } = {},
  ): Promise<t.NetworkStore> {
    const Uri = Doc.Uri;
    const { debugLabel } = options;
    const total = { added: 0, bytes: { in: 0, out: 0 } };
    const life = rx.lifecycle([peer.dispose$, store.dispose$]);
    const { dispose, dispose$ } = life;

    const log = Log.level(options.logLevel, { prefix: debugLabel });
    log.debug(`Debug Logging Webrtc.Store/peer:${peer.id}`);

    const $$ = rx.subject<t.WebrtcStoreEvent>();
    const $ = $$.pipe(rx.takeUntil(dispose$));
    const fire = (e: t.WebrtcStoreEvent) => $$.next(e);
    const shared = await Shared.create({ $, peer, store, index, debugLabel, fire });

    const changed = (payload: t.CrdtSharedChanged) => {
      log.debug('shared/changed', payload);
      Doc.Patch.apply(shared.doc, payload.patches);
      fire({ type: 'crdt:webrtc:shared/Changed', payload });
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
      const adapter = new PeerjsNetworkAdapter(conn);
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
        log.debug('incoming/connection', conn.connectionId);
        const metadata = conn.metadata as t.NetworkStoreConnectMetadata;
        if (metadata.shared) {
          const uri = metadata.shared;
          log.debug('incoming/remote shared state (doc uri):', Uri.shorten(uri));

          /**
           * Retrieve remote state.
           */
          const remote = await store.doc.get<t.CrdtShared>(uri);
          if (!remote) {
            log.debug('incoming/remote crdt could not be retrieved (error).', Uri.shorten(uri));
            return;
          } else {
            log.debug('incoming/remote shared state retrieved (crdt):', toObject(remote.current));
            const events = remote.events(dispose$);
            events.changed$.subscribe((e) => changed(e));
          }
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
      shared,

      get total() {
        return total;
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
      if (e.direction === 'incoming') total.bytes.in += e.bytes;
      if (e.direction === 'outgoing') total.bytes.out += e.bytes;
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
        metadata.shared = shared.doc.uri;
        log.debug('outgoing/before connection (data):', e.peer);
      });
    });

    /**
     * Finish up.
     */
    return api;
  },
} as const;

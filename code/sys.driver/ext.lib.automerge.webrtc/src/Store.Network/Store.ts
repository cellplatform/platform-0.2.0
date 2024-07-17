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
    index: t.StoreIndex,
    options: { debugLabel?: string; logLevel?: t.LogLevelInput } = {},
  ): Promise<t.NetworkStore> {
    const Uri = Doc.Uri;
    const { debugLabel } = options;
    const total = { added: 0, bytes: { in: 0, out: 0 } };
    const life = rx.lifecycle([peer.dispose$, store.dispose$]);
    const { dispose, dispose$ } = life;

    const log = Log.level(options.logLevel, { prefix: debugLabel });
    log.debug(`Debug Logging → Webrtc.Store/peer:${peer.id}`);

    const $$ = rx.subject<t.WebrtcStoreEvent>();
    const $ = $$.pipe(rx.takeUntil(dispose$));
    const fire = (e: t.WebrtcStoreEvent) => $$.next(e);
    const shared = await Shared.create({ $, peer, store, index, debugLabel, fire });

    /**
     * Retrieve and monitor remote [Shared] document.
     */
    const retrieveAndMonitorRemote = async (io: t.IODirection, uri: t.UriString) => {
      log.debug(`${io}/remote shared state (doc uri):`, uri);
      const remote = await store.doc.get<t.CrdtShared>(uri);

      if (!remote) {
        log.debug(`${io}/remote crdt could not be retrieved (error).`, Uri.shorten(uri));
      } else {
        log.debug(`${io}/remote shared state retrieved (crdt):`, toObject(remote.current));
        fire({ type: 'crdt:net:shared/RemoteConnected', payload: { shared: { uri } } });

        const merge = () => {
          const local = shared.doc;
          const before = local.current;
          Doc.merge(remote, local);
          const after = local.current;

          const payload: t.CrdtSharedChanged = { uri: local.uri, before, after };
          log.debug(`${io}:shared/changed`, payload);
          fire({ type: 'crdt:net:shared/Changed', payload });
        };

        remote.events(dispose$).changed$.subscribe(merge);
        merge();
      }

      return remote;
    };

    /**
     * Initialize a network adapter for the given connection ID.
     */
    const initializeAdapter = async (connid: string, io: t.IODirection) => {
      const conn = peer.get.conn.obj.data(connid);
      if (!conn) throw new Error(`Failed to retrieve WebRTC data-connection with id "${connid}".`);

      log.debug(`${io}/connection`, conn.connectionId);
      const metadata = conn.metadata as t.NetworkStoreConnectMetadata;

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
        type: 'crdt:net:webrtc/AdapterAdded',
        payload: { peer: { local: peer.id, remote: conn.peer }, conn: { id: connid } },
      });

      type E = t.CrdtSharedRemoteConnectedEvent;
      conn.on('data', (data: any) => {
        const type: E['type'] = 'crdt:net:shared/RemoteConnected';
        if (typeof data === 'object' && data.type === type) {
          const e = data as E;
          const uri = e.payload.shared.uri;
          retrieveAndMonitorRemote('outgoing', uri);
        }
      });

      /**
       * Incoming: shared-doc sync monitor.
       */
      if (io === 'incoming' && metadata.shared) {
        const remoteUri = metadata.shared;
        log.debug('incoming/remote shared state (doc uri):', remoteUri);
        whenOpen(conn, () => {
          const e: E = {
            type: 'crdt:net:shared/RemoteConnected',
            payload: { shared: { uri: shared.doc.uri } },
          };
          conn.send(e);
          retrieveAndMonitorRemote('incoming', remoteUri);
        });
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
      .subscribe((e) => initializeAdapter(e.connid, e.direction));

    /**
     * [Shared] network document setup.
     *    Catch before an outbound connection starts and publish
     *    the store's URI to it's [Shared] state document.
     */
    events.peer.cmd.beforeOutgoing$.subscribe((e) => {
      type M = t.NetworkStoreConnectMetadata;
      e.metadata<M>((metadata) => (metadata.shared = shared.doc.uri));
      log.debug('outgoing/before connection (data):', e.peer);
    });

    /**
     * Finish up.
     */
    return api;
  },
} as const;

/**
 * Helpers
 */
const whenOpen = (conn: t.PeerJsConnData, fn: () => void) => {
  if (conn.open) fn();
  else conn.once('open', fn);
};

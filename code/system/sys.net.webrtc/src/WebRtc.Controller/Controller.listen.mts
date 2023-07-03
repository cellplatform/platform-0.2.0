import { WebRtcState } from '../WebRtc.State';
import { NetworkSchema } from '../sys.net.schema';
import {
  Crdt,
  Pkg,
  R,
  Time,
  UserAgent,
  WebRtcEvents,
  WebRtcUtils,
  rx,
  slug,
  type t,
} from './common';
import { pruneDeadPeers } from './util.mjs';

const Mutate = WebRtcState.Mutate;

/**
 * TODO 🐷
 * - See tests: "3-way controller"
 * - Refactor required.
 */

/**
 * Start a controller instance to manager the live state of network peers.
 *
 * Notes:
 *    The controller is responsible for keeping a WebRTC network-peer
 *    in sync with a shared/synced CRDT document.
 *
 *    All group peers within the conversation are aware of this shared
 *    document instance.
 *
 *    UI should read/write to the CFDT and the controller will change
 *    the state of the WebRTC network-peers accordingly.
 *
 */
export function listen(
  self: t.Peer,
  options: {
    bus?: t.EventBus<any>;
    doc?: t.NetworkDocSharedRef;
    filedir?: t.Fs;
    dispose$?: t.Observable<any>;
    onConnectStart?: (e: t.WebRtcConnectStart) => void;
    onConnectComplete?: (e: t.WebRtcConnectComplete) => void;
  } = {},
) {
  const { filedir, onConnectStart, onConnectComplete } = options;
  const instance = self.id;
  const bus = rx.busAsType<t.WebRtcEvent>(options.bus ?? rx.bus());

  const lifecycle = rx.lifecycle(options.dispose$);
  const { dispose$, dispose } = lifecycle;
  const clientFactory = WebRtcEvents.factory(bus, self, dispose$);
  const client = clientFactory();
  const doc = options.doc ?? NetworkSchema.genesis({ dispose$ }).doc;
  const state = WebRtcState.init(doc);
  const syncers = new Map<string, t.WebRtcStateSyncer>();

  dispose$.subscribe(() => {
    syncers.clear();
  });

  const updateLocalMetadata = (state: t.NetworkDocSharedRef) => {
    const peers = state.current.network.peers ?? {};
    const localPeer = peers[self.id];
    const ua = UserAgent.current;
    if (localPeer && !R.equals(localPeer.device.userAgent, ua)) {
      state.change((d) => Mutate.updateLocalMetadata(d.network, self.id, { ua }));
    }
  };

  /**
   * Write in [self] in as initial peer.
   */
  doc.change((d) => {
    Mutate.addPeer(d.network, self.id, self.id);
    Mutate.updateLocalMetadata(d.network, self.id);
  });

  /**
   * Ferry the peer-event through the event-bus.
   */
  self.connections$.pipe(rx.takeUntil(dispose$)).subscribe((change) => {
    bus.fire({
      type: 'sys.net.webrtc/conns:changed',
      payload: { instance, change },
    });
  });
  self.error$.pipe(rx.takeUntil(dispose$)).subscribe((error) => {
    bus.fire({
      type: 'sys.net.webrtc/error',
      payload: toWebRtcError(error),
    });
  });
  const toWebRtcError = (error: t.PeerError): t.WebRtcError => ({
    instance,
    kind: 'Peer',
    error,
  });

  /**
   * Info
   */
  client.info.req$.subscribe((e) => {
    const { tx } = e;
    const { name, version } = Pkg;

    const info: t.WebRtcInfo = {
      module: { name, version },
      peer: self,
      state: doc,
      syncers: Array.from(syncers.entries()).map(([_, syncer]) => syncer),
    };

    bus.fire({
      type: 'sys.net.webrtc/info:res',
      payload: { tx, instance, info },
    });
  });

  /**
   * New connections.
   */
  client.connections.changed.data.added$.subscribe(async (conn) => {
    const { local, remote } = conn.peer;
    const initiatedBySelf = conn.metadata.initiatedBy === self.id;

    console.log(initiatedBySelf ? 'ADDED by self' : 'ADDED by remote', conn);

    /**
     * Setup "sync protocol" on newly added data-connections.
     */
    const dispose$ = client.connections.changed.data.removed$.pipe(
      rx.filter((e) => e.id === conn.id),
      rx.take(1),
    );

    const syncer = Crdt.Doc.sync<t.NetworkDocShared>(conn.bus(), doc, {
      /**
       * TODO 🐷
       * - sync-state FS
       * - BUG: error on ".file" not found (sometime)
       */
      filedir,
      dispose$,
      // syncOnStart: true,
    });

    syncers.set(conn.id, { local, remote, syncer });

    doc.change((d) => {
      const { initiatedBy } = conn.metadata;
      // Mutate.addPeer(d.network, self.id, local, { initiatedBy });
      Mutate.addPeer(d.network, self.id, remote, { initiatedBy });
    });

    updateLocalMetadata(doc);

    await syncer.update().complete;
  });

  /**
   * Connection closed (clean up).
   */
  client.connections.changed.data.removed$.subscribe((conn) => {
    syncers.delete(conn.id);
    doc.change((d) => Mutate.removePeer(d.network, conn.peer.remote));
  });

  /**
   * Close requests.
   */
  client.close.req$.subscribe((e) => {
    const { tx } = e;
    const peer = { local: self.id, remote: e.remote };
    const remote = self.connectionsByPeer.find((item) => item.peer.remote === e.remote);

    const done = (error?: string) => {
      bus.fire({
        type: 'sys.net.webrtc/close:res',
        payload: { tx, instance, peer, state: doc.current.network, error },
      });
    };

    if (!remote) {
      return done(`Peer to close not found`);
    } else {
      remote.all.forEach((conn) => conn.dispose());
      done();
    }
  });

  // TEMP 🐷
  const _p = (id: string) => id.split('-')[0];
  const _pp = () => Object.values(doc.current.network.peers).map((peer) => _p(peer.id));

  /**
   * When network peers change ensure all connections are established.
   */
  const onDocPeersChanged = async (state: t.NetworkDocSharedRef) => {
    const peers = state.current.network.peers ?? {};
    const remotePeers = Object.values(peers)
      .filter((item) => item.id !== self.id)
      .filter((item) => !item.error);

    console.log('DOC CHANGED', Crdt.toObject(peers));

    /**
     * Ensure peers are connected.
     */
    const wait = Object.values(remotePeers).map(async (remote) => {
      const { tx } = remote;
      const dataExists = self.connections.all.some((conn) => conn.peer.remote === remote.id);

      if (!dataExists) {
        // const gt = remote.id > self.id;
        const pp = _pp();
        console.log('ADD', 'local:', _p(self.id), '→ remote:', _p(remote.id), pp);

        /**
         * TODO 🐷
         * - initiate this based on the existence of connection entries in the PeerNetwork state
         */

        await connectTo(remote.id, { tx });
      }
    });

    await Promise.all(wait);

    /**
     * Ensure user-agent is up to date.
     */
    updateLocalMetadata(state);
  };

  /**
   * Listen for: Peers added/removed.
   */
  const peerIds = (doc: t.NetworkDocShared) => Object.keys(doc.network.peers ?? {});
  const remotePeerIds = (doc: t.NetworkDocShared) => peerIds(doc).filter((id) => id !== self.id);
  doc.$.pipe(
    rx.map((e) => e.doc),
    rx.distinctUntilChanged((prev, next) => R.equals(peerIds(prev), peerIds(next))),
  ).subscribe(() => onDocPeersChanged(doc));

  /**
   * Listen for: Video connection added.
   */
  doc.$.pipe(
    rx.map((e) => e.doc.network.peers),
    rx.map((e) => e[self.id].conns ?? {}),
    rx.distinctUntilChanged((prev, next) => {
      if (prev.video !== next.video) return false;
      if (prev.screen !== next.screen) return false;
      return true;
    }),
  ).subscribe(async (e) => {
    const remotes = remotePeerIds(doc.current);

    if (e.video) {
      remotes.forEach((id) => self.media(id, 'camera'));
    }
    if (e.screen) {
      remotes.forEach((id) => self.media(id, 'screen'));
    }
  });

  /**
   * Start a connection.
   */
  const connectTo = async (remote: t.PeerId, options: { tx?: string } = {}) => {
    const tx = options.tx ?? slug();
    const local = self.id;
    const peer = { local, remote };

    /**
     * Before.
     */
    const before: t.WebRtcConnectStart = {
      tx,
      instance,
      state: R.clone(doc.current.network),
      peer,
    };
    onConnectStart?.(before);
    bus.fire({ type: 'sys.net.webrtc/connect:start', payload: before });

    /**
     * TODO 🐷
     * - camera option (for audio only)
     */

    /**
     * Connect.
     */
    // let conns: t.PeerConnection[] = [];

    try {
      const dataConn = await self.data(remote); //             <== Start (data).
      // state.change((d) => {
      //   const connections = d.network.peers[remote].connections;
      //   connections.data.push(dataConn.id);
      // });
    } catch (err: any) {
      const error = WebRtcUtils.error.toPeerError(err);
      doc.change((d) => (d.network.peers[remote].error = `[${error.type}] ${err.message}`));
    }

    const s = R.clone(doc.current.network);
    console.log('s|||', s);

    /**
     * After.
     */
    const after: t.WebRtcConnectComplete = {
      tx,
      instance,
      peer,
      state: R.clone(doc.current.network),
    };
    onConnectComplete?.(after);
    bus.fire({ type: 'sys.net.webrtc/connect:complete', payload: after });

    /**
     * TODO 🐷 Experiments
     */

    const _cid = (peer: t.PeerConnectionEndpoints) => {
      // TODO 🐷 - test and move to common Wrangle/Util.
      const { local, remote } = peer;
      const list = [_p(local), _p(remote)].sort();
      return list.join(':');
    };

    await Time.wait(500); // TEMP 🐷

    // console.log('cid', cid);
    self.connections.all.filter((conn) => {
      // conn.metadata.cid === cid;

      console.group('🌳 ', _p(self.id));
      console.log('conn', conn.id, '| cid:', _cid(conn.peer));
      console.log('- connect', _p(conn.peer.local), '⇔', _p(conn.peer.remote));
      console.log('- initiated by:', _p(conn.metadata.initiatedBy ?? ''));
      console.groupEnd();

      return true;
    });

    // const list = self.connections.all.filter((conn) => {
    //   return true
    // })

    const localCid = _cid({ local: self.id, remote });

    const duplicates = self.connections.all
      .filter((conn) => conn.metadata.initiatedBy !== self.id)
      .filter((conn) => _cid(conn.peer) === localCid);

    // console.log('self.connections.all', self.connections.all);
    // console.log('-------------------------------------------');
    console.log('duplicates', duplicates);

    duplicates.forEach((conn) => {
      //
      // TEMP 🐷
      // conn.dispose();
    });

    // await Time.wait(500); // TEMP 🐷
    console.groupEnd();

    // updateLocalMetadata(state);
  };

  /**
   * Connect (request).
   * Initiate a connection via updating the shared {network} state-document.
   */
  client.connect.req$.subscribe((e) => {
    const { tx } = e;
    const local = self.id;
    doc.change((d) => {
      const initiatedBy = local;
      Mutate.addPeer(d.network, local, e.remote, { initiatedBy, tx });
    });
  });

  /**
   * Prune dead peers.
   */
  client.prune.req$.subscribe(async (e) => {
    const { tx } = e;
    const res = await pruneDeadPeers(self, doc);
    const removed = res.removed;
    bus.fire({
      type: 'sys.net.webrtc/prune:res',
      payload: { tx, instance, removed },
    });
  });

  /**
   * PUBLIC API.
   */
  const api: t.WebRtcController = {
    state,

    /**
     * Create a new client (events) interface into the controller.
     */
    client(dispose$?: t.Observable<any>) {
      return clientFactory(dispose$);
    },

    /**
     * Execute a function against a client.
     * NB: Client is immediately disposed of after completion.
     */
    async withClient(fn) {
      const client = clientFactory();
      await fn(client);
      client.dispose();
    },

    /**
     * Lifecycle
     */
    dispose,
    dispose$,
    get disposed() {
      return lifecycle.disposed;
    },
  } as const;

  return api;
}

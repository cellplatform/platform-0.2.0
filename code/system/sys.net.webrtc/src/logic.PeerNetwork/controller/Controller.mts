import { merge } from 'rxjs';
import { delay, distinctUntilChanged, filter, map, take } from 'rxjs/operators';

import { PeerEvents } from '../../logic.PeerNetwork.events';
import {
  Module,
  DEFAULT,
  MediaStreamUtil,
  PeerJS,
  PeerJsUtil,
  R,
  rx,
  slug,
  StringUtil,
  t,
  Time,
  UriUtil,
} from '../common';
import { MemoryRefs, SelfRef } from './Refs.mjs';
import { Status } from './Status.mjs';

type ConnectionKind = t.PeerConnectRes['kind'];

/**
 * EventBus contoller for a WebRTC [Peer] connection.
 */
export function Controller(args: { bus: t.EventBus<any> }): t.PeerController {
  const bus = args.bus as t.EventBus<t.PeerEvent>;
  const events = PeerEvents(bus);
  const { $, dispose$ } = events;
  const refs = MemoryRefs();

  const dispose = () => {
    events.dispose();
    refs.dispose();
    window.removeEventListener('online', handleOnlineStatusChanged);
    window.removeEventListener('offline', handleOnlineStatusChanged);
  };
  dispose$.subscribe(dispose);

  /**
   * Monitor network connectivity.
   */
  const handleOnlineStatusChanged = () => {
    Object.keys(refs.self).forEach((self) => {
      const isOnline = navigator.onLine;
      bus.fire({
        type: 'sys.net/peer/local/online:changed',
        payload: { self, isOnline },
      });
    });
  };
  window.addEventListener('online', handleOnlineStatusChanged);
  window.addEventListener('offline', handleOnlineStatusChanged);

  /**
   * Initialize a new PeerJS data-connection.
   */
  const completeConnection = (
    kind: ConnectionKind,
    direction: t.PeerConnectRes['direction'],
    self: SelfRef,
    conn: t.DataConnection | t.MediaConnection,
    tx?: string,
  ) => {
    const connRef = refs.connection(self).get(conn);

    bus.fire({
      type: 'sys.net/peer/conn/connect:res',
      payload: {
        self: self.id,
        tx: tx || slug(),
        kind,
        direction,
        existing: false,
        remote: connRef.peer.remote.id,
        connection: Status.refToConnection(connRef),
      },
    });

    if (kind === 'data') {
      const data = conn as t.DataConnection;

      data.on('close', async () => {
        /**
         * NOTE:
         * The close event is not being fired for [Media] connections.
         * Issue: https://github.com/peers/peerjs/issues/780
         *
         * See work-around that uses the [netbus] "connection.ensureClosed" strategy.
         */
        const peer = connRef.peer;
        events.connection(peer.self, peer.remote.id).close(connRef.id);
      });

      data.on('data', (data: any) => {
        if (typeof data === 'object') {
          const source = { peer: connRef.peer.remote.id, connection: connRef.id };
          bus.fire({
            type: 'sys.net/peer/data/in',
            payload: { self: self.id, data, source },
          });
        }
      });
    }

    return connRef;
  };

  const initializeLocalPeer = (e: t.PeerLocalCreateReq) => {
    return new Promise<{ self: SelfRef; error?: string }>((resolve) => {
      const createdAt = Time.now.timestamp;
      const signal = StringUtil.parseEndpointAddress({
        address: e.signal,
        key: DEFAULT.PEERJS_KEY,
      });
      const { host, path, port, secure, key } = signal;
      const peer = new PeerJS(e.self, { host, path, port, secure, key });
      const self: SelfRef = { id: e.self, peer, createdAt, signal, connections: [], media: {} };

      let complete = false;
      const done = (error?: string) => {
        if (!complete) resolve({ self, error });
        timeout?.cancel();
        complete = true;
      };

      /**
       * Listen for incoming DATA connection requests.
       */
      peer.on('connection', (dataConnection) => {
        dataConnection.on('open', () => {
          refs.connection(self).add('data', 'incoming', dataConnection);
          completeConnection('data', 'incoming', self, dataConnection);
        });
      });

      /**
       * Listen for incoming MEDIA connection requests (video/screen).
       */
      peer.on('call', async (mediaConnection) => {
        const metadata = (mediaConnection.metadata || {}) as t.PeerConnectionMetadataMedia;
        const { kind, constraints } = metadata;

        const answer = (localStream?: MediaStream) => {
          mediaConnection.answer(localStream);
          mediaConnection.on('stream', (remoteStream) => {
            refs.connection(self).add(kind, 'incoming', mediaConnection, remoteStream);
            completeConnection(kind, 'incoming', self, mediaConnection);
          });
        };

        if (kind === 'media/video') {
          const local = await events.media(self.id).request({ kind, constraints });
          answer(local.media);
        }

        if (kind === 'media/screen') {
          // NB: Screen shares do not send back another stream so do
          //     not request it from the user.
          answer();
        }
      });

      /**
       * Wait for peer to fully initialize itself.
       */
      const timeout = Time.delay(e.timeout ?? 3000, () => {
        const err = `Timeout (${e.timeout}ms): Failed to initialize local peer (${e.self}) via signal server "${signal.host}"`;
        done(err);
      });
      peer.on('open', () => done());
    });
  };

  /**
   * CREATE a new network client.
   */
  rx.payload<t.PeerLocalInitReqEvent>($, 'sys.net/peer/local/init:req')
    .pipe(delay(0))
    .subscribe(async (e) => {
      const id = e.self;
      let error: undefined | t.PeerError;

      if (!refs.self[id]) {
        const res = await initializeLocalPeer(e);
        if (res.error) error = { message: res.error };
        refs.self[id] = res.self;
      }

      const self = refs.self[id];
      bus.fire({
        type: 'sys.net/peer/local/init:res',
        payload: {
          self: e.self,
          createdAt: self.createdAt,
          signal: self.signal,
          error,
        },
      });
    });

  /**
   * STATUS
   */
  rx.payload<t.PeerLocalStatusReqEvent>($, 'sys.net/peer/local/status:req')
    .pipe(delay(0))
    .subscribe((e) => {
      const tx = e.tx || slug();
      const self = refs.self[e.self];
      const peer = self ? Status.refToSelf(self) : undefined;
      const exists = Boolean(peer);
      bus.fire({
        type: 'sys.net/peer/local/status:res',
        payload: { self: e.self, tx, exists, peer },
      });
    });

  /**
   * STATUS CHANGE
   */
  const statusChanged$ = merge(
    $.pipe(
      filter((e) => {
        const types: t.PeerEvent['type'][] = [
          'sys.net/peer/local/init:res',
          'sys.net/peer/local/purge:res',
          'sys.net/peer/local/online:changed',
          'sys.net/peer/conn/connect:res',
          'sys.net/peer/conn/disconnect:res',
        ];
        return types.includes(e.type);
      }),
    ),
  ).pipe(
    map((event) => ({ selfRef: refs.self[event.payload.self], event })),
    filter((e) => Boolean(e.selfRef)),
    map((e) => ({ event: e.event, status: Status.refToSelf(e.selfRef) })),
    distinctUntilChanged((prev, next) => R.equals(prev.status, next.status)),
  );

  statusChanged$.subscribe((e) => {
    bus.fire({
      type: 'sys.net/peer/local/status:changed',
      payload: { self: e.status.id, peer: e.status, event: e.event },
    });
  });

  rx.event<t.PeerLocalStatusRefreshEvent>($, 'sys.net/peer/local/status:refresh')
    .pipe()
    .subscribe((event) => {
      const { self } = event.payload;
      const selfRef = refs.self[self];
      if (selfRef) {
        bus.fire({
          type: 'sys.net/peer/local/status:changed',
          payload: { self, peer: Status.refToSelf(selfRef), event },
        });
      }
    });

  /**
   * PURGE
   */
  rx.payload<t.PeerLocalPurgeReqEvent>($, 'sys.net/peer/local/purge:req')
    .pipe()
    .subscribe((e) => {
      const tx = e.tx || slug();
      const self = refs.self[e.self];
      const select = typeof e.select === 'object' ? e.select : { closedConnections: true };

      let changed = false;
      const purged: t.PeerLocalPurged = {
        closedConnections: { data: 0, video: 0, screen: 0 },
      };

      const fire = (payload?: Partial<t.PeerLocalPurgeRes>) => {
        bus.fire({
          type: 'sys.net/peer/local/purge:res',
          payload: { self: e.self, tx, changed, purged, ...payload },
        });
      };
      const fireError = (message: string) => fire({ error: { message } });

      if (!self) {
        const message = `The local PeerNetwork '${e.self}' does not exist`;
        return fireError(message);
      }

      if (select.closedConnections) {
        const closed = self.connections.filter((item) => !Status.refToConnection(item).isOpen);
        self.connections = self.connections.filter(
          ({ peer: id }) => !closed.some((c) => c.peer === id),
        );
        closed.forEach((item) => {
          changed = true;
          if (item.kind === 'data') purged.closedConnections.data++;
          if (item.kind === 'media/video') purged.closedConnections.video++;
          if (item.kind === 'media/screen') purged.closedConnections.screen++;
        });
      }

      fire();
    });

  /**
   * CONNECT: Outgoing
   */
  rx.payload<t.PeerConnectReqEvent>($, 'sys.net/peer/conn/connect:req')
    .pipe(filter((e) => e.direction === 'outgoing'))
    .subscribe(async (e) => {
      const self = refs.self[e.self];
      const tx = e.tx || slug();

      const module = Module.info;
      const userAgent = navigator.userAgent;
      const parent = e.parent;
      const remote = UriUtil.peer.trimPrefix(e.remote);

      const fire = (payload?: Partial<t.PeerConnectRes>) => {
        const existing = Boolean(payload?.existing);
        bus.fire({
          type: 'sys.net/peer/conn/connect:res',
          payload: {
            kind: e.kind,
            self: e.self,
            tx,
            remote,
            direction: 'outgoing',
            existing,
            ...payload,
          },
        });
      };
      const fireError = (message: string) => fire({ error: { message } });

      if (!self) {
        const message = `The local PeerNetwork '${e.self}' does not exist`;
        return fireError(message);
      }

      if (self.id === remote) {
        const message = `Cannot connect to self`;
        return fireError(message);
      }

      /**
       * START a data connection.
       */
      if (e.kind === 'data') {
        const metadata: t.PeerConnectionMetadataData = { kind: e.kind, module, userAgent, parent };
        const reliable = e.isReliable;
        const errorMonitor = PeerJsUtil.error(self.peer);
        const dataConnection = self.peer.connect(remote, { reliable, metadata });

        refs.connection(self).add('data', 'outgoing', dataConnection);

        dataConnection.on('open', () => {
          // SUCCESS: Connected to the remote peer.
          errorMonitor.dispose();
          completeConnection('data', 'outgoing', self, dataConnection, tx);
        });

        // Listen for a connection error.
        // Will happen on timeout (remote-peer not found on the network)
        errorMonitor.$.pipe(
          filter((err) => err.type === 'peer-unavailable'),
          filter((err) => err.message.includes(`peer ${remote}`)),
          take(1),
        ).subscribe((err) => {
          // FAIL
          errorMonitor.dispose();
          refs.connection(self).remove(dataConnection);
          fireError(`Failed to connect to peer '${remote}'. The remote target did not respond.`);
        });
      }

      /**
       * START a media (video) call.
       */
      if (e.kind === 'media/video' || e.kind === 'media/screen') {
        const { constraints } = e;

        // Retrieve the media stream.
        const res = await events.media(self.id).request({ kind: e.kind, constraints });
        const localStream = res.media;
        if (res.error || !localStream) {
          const err = res.error?.message || `Failed to retrieve a local media stream (${self.id}).`;
          return fireError(err);
        }

        // Start the network/peer connection.
        const metadata: t.PeerConnectionMetadataMedia = {
          kind: e.kind,
          constraints,
          module,
          userAgent,
          parent,
        };
        const mediaConnection = self.peer.call(remote, localStream, { metadata });
        const connRef = refs.connection(self).add(e.kind, 'outgoing', mediaConnection);
        connRef.localStream = localStream;

        // Manage timeout.
        const msecs = e.timeout ?? 10 * 1000;
        const timeout = Time.delay(msecs, () => {
          refs.connection(self).remove(mediaConnection);
          const err = `Failed to connect [${e.kind}] to peer '${remote}'. The connection attempt timed out.`;
          fireError(err);
        });

        const completeMediaConnection = () => {
          timeout.cancel();
          completeConnection(e.kind, 'outgoing', self, mediaConnection, tx);
        };

        if (e.kind === 'media/video') {
          mediaConnection.on('stream', (remoteStream) => {
            if (timeout.isCancelled) return;
            connRef.remoteStream = remoteStream;
            completeMediaConnection();
          });
        }

        if (e.kind === 'media/screen') {
          // NB: Complete immediately without waiting for return stream.
          //     Screen shares are always one-way (out) so there will be no incoming stream.
          const completeUponOpen = () => {
            if (!mediaConnection.open) return Time.delay(50, completeUponOpen);
            return completeMediaConnection();
          };
          completeUponOpen();
        }

        // Listen for external ending of the stream and clean up accordingly.
        MediaStreamUtil.onEnded(localStream, () => {
          events.connection(self.id, remote).close(connRef.id);
        });
      }
    });

  /**
   * DISCONNECT from a remote peer.
   */
  rx.payload<t.PeerDisconnectReqEvent>($, 'sys.net/peer/conn/disconnect:req')
    .pipe(filter((e) => Boolean(refs.self[e.self])))
    .subscribe(async (e) => {
      const selfRef = refs.self[e.self];
      const tx = e.tx || slug();

      const fire = (payload?: Partial<t.PeerDisconnectRes>) => {
        const connection = e.connection;
        bus.fire({
          type: 'sys.net/peer/conn/disconnect:res',
          payload: { self: e.self, tx, connection, ...payload },
        });
      };
      const fireError = (message: string) => fire({ error: { message } });

      if (!selfRef) {
        const message = `The local PeerNetwork '${e.self}' does not exist`;
        return fireError(message);
      }

      const connRef = selfRef.connections.find((item) => item.id === e.connection);
      if (!connRef) {
        const message = `The connection to close '${e.connection}' does not exist`;
        return fireError(message);
      }

      // Ensure all child connections are closed.
      const children = selfRef.connections.filter(({ parent }) => parent === e.connection);
      await Promise.all(
        children.map((child) => {
          const { self, remote } = child.peer;
          return events.connection(self, remote.id).close(child.id);
        }),
      );

      // Close the connection.
      if (connRef.conn.open) connRef.conn.close();
      fire({});
    });

  /**
   * DATA:OUT: Send
   */
  rx.payload<t.PeerDataOutReqEvent>($, 'sys.net/peer/data/out:req')
    .pipe(filter((e) => Boolean(refs.self[e.self])))
    .subscribe((e) => {
      const selfRef = refs.self[e.self];
      const tx = e.tx || slug();

      const targets = selfRef.connections
        .filter((ref) => ref.kind === 'data')
        .filter((ref) => (e.targets || []).some((uri) => uri === ref.uri));

      // Send the data over the wire.
      targets.forEach((ref) => {
        (ref.conn as t.DataConnection).send(e.data);
      });

      // Fire response event.
      bus.fire({
        type: 'sys.net/peer/data/out:res',
        payload: {
          tx,
          self: e.self,
          sent: targets.map((ref) => ({ peer: ref.peer.remote.id, connection: ref.id })),
          data: e.data,
        },
      });
    });

  /**
   * REMOTE: exists
   */
  rx.payload<t.PeerRemoteExistsReqEvent>($, 'sys.net/peer/remote/exists:req')
    .pipe()
    .subscribe(async (e) => {
      const { tx, self, remote } = e;
      const connection = events.connection(self, remote);

      let exists = false;
      const res = await connection.open.data({ isReliable: false });
      const id = res.connection?.id;

      if (!res.error) exists = true;
      if (id) connection.close(id); // Clean up.

      // Fire response event.
      bus.fire({
        type: 'sys.net/peer/remote/exists:res',
        payload: { tx, self, remote, exists },
      });
    });

  /**
   * API
   */
  return {
    dispose$,
    dispose,
    events,
  };
}

import { Path, PeerJS, R, rx, t } from './common';
import { Util } from './util.mjs';
import { MemoryState } from './WebRTC.state.mjs';

type HostName = string;

/**
 * Start a new local peer.
 */
export function peer(args: {
  signal: HostName;
  id?: t.PeerId;
  getStream?: t.PeerGetMediaStream;
}): Promise<t.Peer> {
  return new Promise<t.Peer>((resolve, reject) => {
    const { getStream } = args;
    const state = MemoryState();
    const id = Util.asId(args.id ?? Util.randomPeerId());
    const signal = Path.trimHttpPrefix(args.signal);
    const rtc = new PeerJS(id, {
      key: 'conn',
      path: '/',
      secure: true,
      port: 443,
      debug: 2,
      host: signal,
    });

    const { dispose, dispose$ } = rx.disposable();
    let _disposed = false;
    dispose$.subscribe(() => {
      rtc.destroy();
      api.connections.forEach((conn) => conn.dispose());
      _disposed = true;
    });

    const api: t.Peer = {
      kind: 'local:peer',
      signal,
      id,

      connections$: state.connections$,
      get connections() {
        return state.connections.all;
      },
      get dataConnections() {
        return state.connections.data;
      },
      get mediaConnections() {
        return state.connections.media;
      },
      get connectionsByPeer() {
        const byPeer = R.groupBy((item) => item.peer.remote, api.connections);
        return Object.entries(byPeer).map(([peer, all]) => {
          const item: t.PeerConnectionsByPeer = {
            peer,
            all,
            get data() {
              return Util.filter.onDataConnection(all);
            },
            get media() {
              return Util.filter.onMediaConnection(all);
            },
          };
          return item;
        });
      },

      /**
       * Start a data connection.
       */
      data(connectTo, options = {}) {
        return new Promise<t.PeerDataConnection>((resolve, reject) => {
          const id = Util.asId(connectTo);
          const name = options.name ?? 'Unnamed';
          const metadata: t.PeerMetaData = { name };
          const conn = rtc.connect(id, { reliable: true, metadata });
          conn.on('error', (err) => reject(err));
          conn.on('open', async () => resolve(await state.storeData(conn)));
        });
      },

      /**
       * Start a media connection (video/audio/screen).
       */
      media(connectTo, input) {
        return new Promise<t.PeerMediaConnection>(async (resolve, reject) => {
          if (!getStream) {
            const err = Error(`Media connections require a "getStream" function to be provided.`);
            return reject(err);
          }

          const done = (res: t.PeerMediaConnection) => {
            res.dispose$
              .pipe(rx.filter(() => api.mediaConnections.length === 0))
              .subscribe(() => stream.done());
            resolve(res);
          };

          const id = Util.asId(connectTo);
          const metadata: t.PeerMetaMedia = { input };
          const stream = await getStream(input);
          const local = stream?.media;

          if (!local) {
            const err = Error(`No local media-stream available. Unable to make call.`);
            return reject(err);
          }

          const conn = rtc.call(id, local, { metadata });
          conn.on('error', (err) => reject(err));

          if (input === 'camera') {
            // Listen for the remote-peer response returning it's camera stream (2-way).
            conn.on('stream', async (remote) => {
              const res = await state.storeMedia(conn, { local, remote });
              done(res);
            });
          }

          if (input === 'screen') {
            // NB: No remote stream is returned for screen sharing.
            const res = await state.storeMedia(conn, { local });
            done(res);
          }
        });
      },

      dispose,
      dispose$,
      get disposed() {
        return _disposed;
      },
    };

    rtc.on('open', () => resolve(api));
    rtc.on('error', (err) => reject(err));

    /**
     * Handle incoming connections.
     */
    rtc.on('connection', (conn) => conn.on('open', () => state.storeData(conn)));
    rtc.on('call', async (conn) => {
      const metadata: t.PeerMetaMedia = conn.metadata;
      const input = metadata?.input;
      let local: MediaStream | undefined;

      if (!input) {
        console.warn(`[WebRTC] No meta-data on incoming connection. Call rejected.`);
        return;
      }

      if (input === 'camera') {
        const stream = await getStream?.('camera');
        local = stream?.media;
        if (!local) {
          const msg = `[WebRTC] No local media-stream of kind "${input}" available. Incoming call rejected.`;
          console.warn(msg);
          return;
        }
      }

      conn.on('stream', (remote) => state.storeMedia(conn, { local, remote }));
      conn.answer(local);
    });
  });
}

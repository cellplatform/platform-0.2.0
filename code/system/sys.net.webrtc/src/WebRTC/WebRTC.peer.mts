import { Path, PeerJS, rx, t, R } from './common';
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

      connections$: state.connections.$,
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
          const item: t.PeerConnectionSet = {
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
      data(connectTo) {
        return new Promise<t.PeerDataConnection>((resolve, reject) => {
          const id = Util.asId(connectTo);
          const conn = rtc.connect(id, { reliable: true });
          conn.on('error', (err) => reject(err));
          conn.on('open', async () => resolve(await state.storeData(conn)));
        });
      },

      /**
       * Start a media connection (video/audio/screen).
       */
      media(connectTo, kind) {
        return new Promise<t.PeerMediaConnection>(async (resolve, reject) => {
          if (!getStream) {
            const err = Error(`Media connections require a "getStream" function to be provided.`);
            return reject(err);
          }

          const id = Util.asId(connectTo);
          const stream = await getStream(kind);
          const local = stream?.media;

          if (!local) {
            const err = Error(`No local media-stream available. Unable to make call.`);
            return reject(err);
          }

          const conn = rtc.call(id, local);
          conn.on('error', (err) => reject(err));
          conn.on('stream', async (remote) => {
            const res = await state.storeMedia(conn, { local, remote });

            res.dispose$
              .pipe(rx.filter(() => api.mediaConnections.length === 0))
              .subscribe(() => stream.done());

            resolve(res);
          });
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
      const stream = await getStream?.('camera');
      if (!stream?.media) {
        console.warn(`[WebRTC] No local media-stream available. Incoming call rejected.`);
      } else {
        const local = stream.media;
        conn.on('stream', (remote) => state.storeMedia(conn, { local, remote }));
        conn.answer(local);
      }
    });
  });
}

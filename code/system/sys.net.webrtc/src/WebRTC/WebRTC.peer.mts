import { Path, PeerJS, rx, t } from './common';
import { Util } from './util.mjs';
import { MemoryState } from './WebRTC.state.mjs';

type HostName = string;
type GetMediaStream = () => Promise<MediaStream | undefined>;

/**
 * Start a new local peer.
 */
export function peer(args: {
  signal: HostName;
  id?: t.PeerId;
  getLocalStream?: GetMediaStream;
}): Promise<t.Peer> {
  return new Promise<t.Peer>((resolve, reject) => {
    const state = MemoryState();
    const id = Util.cleanId(args.id ?? Util.randomPeerId());
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

      /**
       * Start a data connection.
       */
      data(connectTo) {
        return new Promise<t.PeerDataConnection>((resolve, reject) => {
          const id = Util.cleanId(connectTo);
          const conn = rtc.connect(id, { reliable: true });
          conn.on('error', (err) => reject(err));
          conn.on('open', async () => resolve(await state.storeData(conn)));
        });
      },

      /**
       * Start a media connection (video/audio/screen).
       */
      media(connectTo, local) {
        return new Promise<t.PeerMediaConnection>((resolve, reject) => {
          const id = Util.cleanId(connectTo);
          const conn = rtc.call(id, local);
          conn.on('error', (err) => reject(err));
          conn.on('stream', (remote) => resolve(state.storeMedia(conn, { local, remote })));
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
      const local = await args.getLocalStream?.();
      if (!local) {
        console.warn(`[WebRTC] No local media-stream available. Incoming call rejected.`);
      } else {
        conn.on('stream', (remote) => state.storeMedia(conn, { local, remote }));
        conn.answer(local);
      }
    });
  });
}

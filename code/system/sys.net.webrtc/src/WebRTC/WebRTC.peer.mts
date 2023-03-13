import { Path, PeerJS, rx, t, WebRTCUtil, slug } from './common';
import { MemoryState } from './WebRTC.state.mjs';

type Options = {
  id?: t.PeerId;
  getStream?: t.PeerGetMediaStream;
  log?: boolean;
};
type SignalServer = {
  host: string;
  path: string;
  key: string;
};

/**
 * Start a new local peer.
 */
export function peer(endpoint: SignalServer, options: Options = {}): Promise<t.Peer> {
  return new Promise<t.Peer>((resolve, reject) => {
    const { getStream } = options;

    const tx = `peer.tx.${slug()}`;
    const state = MemoryState();
    const id = WebRTCUtil.asId(options.id ?? WebRTCUtil.randomPeerId());
    const key = endpoint.key;
    const host = Path.trimHttpPrefix(endpoint.host);
    const path = `/${Path.trimSlashes(endpoint.path)}`;
    const signal = host + path;

    if (options.log) {
      console.group('🔒 Peer Connection (WebRTC)');
      console.info('host:', host);
      console.info('path:', path);
      console.info('key:', key, '(api)');
      console.info('tx:', tx, '(in-memory instance)');
      console.groupEnd();
    }

    const rtc = new PeerJS(id, {
      host,
      path,
      key,
      secure: true,
      port: 443,
      debug: 2,
    });

    const { dispose, dispose$ } = rx.disposable();
    let _disposed = false;
    dispose$.subscribe(() => {
      api.connections.all.forEach((conn) => conn.dispose());
      rtc.destroy();
      error$.complete();
      _disposed = true;
    });

    const error$ = new rx.Subject<t.PeerError>();
    rtc.on('error', (err) => error$.next(WebRTCUtil.error.toError(err)));

    const api: t.Peer = {
      kind: 'local:peer',
      signal,
      id,
      tx,

      connections$: state.connections$,
      get connections() {
        return state.connections;
      },
      get connectionsByPeer() {
        return WebRTCUtil.connections.byPeer(id, state.connections.all);
      },

      /**
       * Start a data connection.
       */
      data(connectTo, options = {}) {
        return new Promise<t.PeerDataConnection>((resolve, reject) => {
          const id = WebRTCUtil.asId(connectTo);
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
              .pipe(rx.filter(() => api.connections.media.length === 0))
              .subscribe(() => stream.done());
            resolve(res);
          };

          const id = WebRTCUtil.asId(connectTo);
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

      error$: error$.pipe(rx.takeUntil(dispose$)),
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

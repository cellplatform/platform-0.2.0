import { Path, PeerJS, rx, type t, WebRtcUtils } from './common';
import { MemoryState } from './WebRtc.memory.mjs';

type Options = {
  id?: t.PeerId;
  log?: boolean;
  getStream?: t.PeerGetMediaStream;
  dispose$?: t.Observable<any>;
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

    const state = MemoryState();
    const tx = state.tx;
    const id = WebRtcUtils.asId(options.id ?? WebRtcUtils.randomPeerId());
    const host = Path.trimHttpPrefix(endpoint.host);
    const path = `/${Path.trimSlashes(endpoint.path)}`;
    const key = endpoint.key;
    const signal = host + path;
    const port = 443;

    if (options.log) {
      console.group('🐚 WebRTC Peer');
      console.info(' - namespace:', 'sys.net.webrtc');
      console.info(' - host:', host);
      console.info(' - path:', path);
      console.info(' - key:', `"${key}" (api)`);
      console.info(' - secure:', { port }, '🔒');
      console.info(' - tx:', `"${tx}" (in-memory instance)`);
      console.groupEnd();
    }

    const rtc = new PeerJS(id, {
      host,
      path,
      key,
      port,
      secure: true,
      debug: 2,
    });

    const { dispose, dispose$ } = rx.disposable(options.dispose$);
    let _disposed = false;
    dispose$.subscribe(() => {
      api.connections.all.forEach((conn) => conn.dispose());
      rtc.destroy();
      error$.complete();
      _disposed = true;
    });

    const error$ = new rx.Subject<t.PeerError>();
    rtc.on('error', (err) => error$.next(WebRtcUtils.error.toPeerError(err)));

    const api: t.Peer = {
      kind: 'local:peer',
      tx,
      id,
      signal,

      connections$: state.connections$,
      get connections() {
        return state.connections;
      },
      get connectionsByPeer() {
        return WebRtcUtils.connections.byPeer(id, state.connections.all);
      },

      /**
       * Start a data connection.
       */
      data(connectTo) {
        return new Promise<t.PeerDataConnection>((resolve, reject) => {
          const id = WebRtcUtils.asId(connectTo);
          const initiatedBy = api.id;
          const metadata: t.PeerMetaData = { initiatedBy };
          const conn = rtc.connect(id, { reliable: true, metadata });

          const fail = (err: Error) => {
            cleanup();
            reject(err);
          };

          const handleError = (err: Error) => fail(err);
          const cleanup = () => rtc.removeListener('error', handleError);
          rtc.addListener('error', handleError);

          conn.on('error', (err) => fail(err));
          conn.on('open', async () => {
            const res = await state.storeData(conn);
            cleanup();
            resolve(res);
          });
        });
      },

      /**
       * Start a media connection (video/audio/screen).
       */
      media(connectTo, input, options = {}) {
        return new Promise<t.PeerMediaConnection>(async (resolve, reject) => {
          if (!getStream) {
            const err = Error(`Media connections require a "getStream" function to be provided.`);
            return reject(err);
          }

          const success = (res: t.PeerMediaConnection) => {
            res.dispose$
              .pipe(rx.filter(() => api.connections.media.length === 0))
              .subscribe(() => stream.done());
            resolve(res);
          };

          const fail = (err: Error) => {
            cleanup();
            reject(err);
          };

          const handleError = (err: Error) => fail(err);
          const cleanup = () => rtc.removeListener('error', handleError);
          rtc.addListener('error', handleError);

          const id = WebRtcUtils.asId(connectTo);
          const initiatedBy = api.id;
          const metadata: t.PeerMetaMedia = { input, initiatedBy };
          const stream = await getStream(input);
          const local = stream?.media;

          if (!local) {
            const err = new Error(`No local media-stream available. Unable to make call.`);
            return fail(err);
          }

          const conn = rtc.call(id, local, { metadata });
          conn.on('error', (err) => fail(err));

          if (input === 'camera') {
            // Listen for the remote-peer response returning it's camera stream (2-way).
            conn.on('stream', async (remote) => {
              const res = await state.storeMedia(conn, { local, remote });
              success(res);
            });
          }

          if (input === 'screen') {
            // NB: No remote stream is returned for screen sharing.
            const res = await state.storeMedia(conn, { local });
            success(res);
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

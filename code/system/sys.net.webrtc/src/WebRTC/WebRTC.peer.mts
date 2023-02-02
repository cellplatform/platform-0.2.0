import { Path, PeerJS, rx, t } from './common';
import { PeerDataConnection } from './Peer.Data.mjs';
import { PeerMediaConnection } from './Peer.Media.mjs';
import { Util } from './util.mjs';

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
    dispose$.subscribe(() => {
      memory.connections.forEach((conn) => conn.dispose());
      rtc.destroy();
    });

    const memory = { connections: [] as t.PeerConnection[] };
    const connections$ = new rx.Subject<t.PeerConnectionChange>();

    const State = {
      fireChanged<P extends t.PeerConnectionChange>(action: P['action'], subject: P['subject']) {
        const kind = subject.kind;
        const connections = api.connections;
        connections$.next({ kind, action, connections, subject } as P);
      },

      handleDispose(subject: t.PeerConnection) {
        subject.dispose$.subscribe(() => {
          memory.connections = memory.connections.filter((item) => item.id !== subject.id);
          State.fireChanged('removed', subject);
          if (subject.kind === 'data') State.ensureClosed(subject);
        });
      },

      ensureClosed(data: t.PeerDataConnection) {
        /**
         * NOTE:
         * The close event is not being fired for [Media] connections.
         * Issue: https://github.com/peers/peerjs/issues/780
         *
         * This work-around checks all media-connections connected to the
         * remote peer if there are no other data-connections open.
         */
        console.log('🐷 ensure closed', data);

        /**
         * TODO 🐷
         */
      },

      data(conn: t.DataConnection) {
        const subject = PeerDataConnection(conn);
        memory.connections.push(subject);
        State.handleDispose(subject);
        State.fireChanged('added', subject);
        return subject;
      },

      async media(conn: t.MediaConnection, stream: t.PeerMediaStreams) {
        const existing = api.mediaConnections.find((item) => item.id === conn.connectionId);
        if (existing) return existing;

        const subject = PeerMediaConnection(conn, stream);
        memory.connections.push(subject);
        State.handleDispose(subject);
        State.fireChanged('added', subject);
        return subject;
      },
    };

    const api: t.Peer = {
      kind: 'local:peer',
      signal,
      id,

      connections$: connections$.asObservable(),
      get connections() {
        return [...memory.connections];
      },
      get dataConnections() {
        const list = memory.connections;
        return list.filter(({ kind }) => kind === 'data') as t.PeerDataConnection[];
      },
      get mediaConnections() {
        const list = memory.connections;
        return list.filter(({ kind }) => kind === 'media') as t.PeerMediaConnection[];
      },

      /**
       * Start a data connection.
       */
      data(connectTo) {
        return new Promise<t.PeerDataConnection>((resolve, reject) => {
          const id = Util.cleanId(connectTo);
          const conn = rtc.connect(id, { reliable: true });
          conn.on('error', (err) => reject(err));
          conn.on('open', () => resolve(State.data(conn)));
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
          conn.on('stream', (remote) => resolve(State.media(conn, { local, remote })));
        });
      },

      dispose,
      dispose$,
    };

    rtc.on('open', () => resolve(api));
    rtc.on('error', (err) => reject(err));

    /**
     * Handle incoming connections.
     */
    rtc.on('connection', (conn) => conn.on('open', () => State.data(conn)));
    rtc.on('call', async (conn) => {
      const local = await args.getLocalStream?.();
      if (!local) {
        console.warn(`[WebRTC] No local media-stream available. Incoming call rejected.`);
      } else {
        conn.on('stream', (remote) => State.media(conn, { local, remote }));
        conn.answer(local);
      }
    });
  });
}

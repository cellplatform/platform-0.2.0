import { rx, cuid, t, PeerJS, Path } from './common';
import { Util } from './util.mjs';
import { PeerDataConnection } from './Peer.Data.mjs';

type UrlString = string;
export type DataPeer = ReturnType<typeof PeerDataConnection>;

/**
 * Library for working with WebRTC peer-to-peer connections.
 */
export const WebRTC = {
  Util,

  /**
   * Start a new local peer.
   */
  peer(host: UrlString, options: { id?: t.PeerId } = {}): Promise<t.Peer> {
    return new Promise<t.Peer>((resolve, reject) => {
      host = Path.trimHttpPrefix(host);
      const id = Util.toId(options.id ?? cuid());
      const rtc = new PeerJS(id, {
        key: 'conn',
        path: '/',
        secure: true,
        port: 443,
        debug: 2,
        host,
      });

      const { dispose, dispose$ } = rx.disposable();
      dispose$.subscribe(() => {
        memory.connections.forEach((conn) => conn.dispose());
        rtc.destroy();
      });

      const memory = { connections: [] as t.PeerConnection[] };
      const connections$ = new rx.Subject<t.PeerConnectionChange>();

      const Initialize = {
        data(conn: t.DataConnection) {
          const subject = PeerDataConnection(conn);
          memory.connections.push(subject);

          const fireChanged = (action: t.PeerDataConnectionChange['action']) => {
            const connections = api.connections;
            connections$.next({ kind: 'data', action, connections, subject });
          };

          subject.dispose$.subscribe(() => {
            memory.connections = memory.connections.filter((item) => item.id === id);
            fireChanged('removed');
          });

          fireChanged('added');
          return subject;
        },
      };

      const api: t.Peer = {
        dispose,
        dispose$,
        id,
        host,

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
        data(connectTo: t.PeerId) {
          return new Promise<DataPeer>((resolve, reject) => {
            const id = Util.toId(connectTo);
            const conn = rtc.connect(id, { reliable: true });
            conn.on('error', (err) => reject(err));
            conn.on('open', () => resolve(Initialize.data(conn)));
          });
        },
      };

      rtc.on('open', () => resolve(api));
      rtc.on('error', (err) => reject(err));
      rtc.on('connection', (conn) => conn.on('open', () => Initialize.data(conn)));
    });
  },
};

import { Path, PeerJS, rx, t } from './common';
import { PeerDataConnection } from './Peer.Data.mjs';
import { Util } from './util.mjs';

type HostName = string;

/**
 * Library for working with WebRTC peer-to-peer connections.
 */
export const WebRTC = {
  Util,

  /**
   * Start a new local peer.
   */
  peer(signal: HostName, options: { id?: t.PeerId } = {}): Promise<t.Peer> {
    return new Promise<t.Peer>((resolve, reject) => {
      const id = Util.cleanId(options.id ?? Util.randomPeerId());
      const host = Path.trimHttpPrefix(signal);
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
        data(connectTo: t.PeerId) {
          return new Promise<t.PeerDataConnection>((resolve, reject) => {
            const id = Util.cleanId(connectTo);
            const conn = rtc.connect(id, { reliable: true });
            conn.on('error', (err) => reject(err));
            conn.on('open', () => resolve(Initialize.data(conn)));
          });
        },

        dispose,
        dispose$,
      };

      rtc.on('open', () => resolve(api));
      rtc.on('error', (err) => reject(err));
      rtc.on('connection', (conn) => conn.on('open', () => Initialize.data(conn)));
    });
  },
};

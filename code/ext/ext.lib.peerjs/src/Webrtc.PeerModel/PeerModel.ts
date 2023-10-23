import { PatchState, type t } from './common';

/**
 * Peer model.
 */
export const PeerModel = {
  /**
   * Wrap a PeerJS object with a stateful management model.
   */
  wrap(peer: t.Peer) {
    const local = peer.id;
    const initial: t.PeerState = { open: false, connections: [] };
    const state = PatchState.init<t.PeerState>({ initial });

    const Get = {
      conn: {
        exists: (s: t.PeerState, id: string) => Boolean(Get.conn.item(s, id)),
        item: (s: t.PeerState, id: string) => s.connections.find((item) => item.id === id),
        object(s: t.PeerState, id: string) {
          const item = Get.conn.item(s, id);
          return item ? peer.getConnection(item.peer.remote, id) : undefined;
        },
      },
    } as const;

    const DataConnection = {
      monitor(conn: t.DataConnection) {
        const id = conn.connectionId;
        conn.on('data', () => {});
        conn.on('close', () => {
          state.change((d) => (d.connections = d.connections.filter((item) => item.id !== id)));
          api.disconnect(id);
        });
        conn.on('error', (err) => {
          console.log('error data', conn, err);
        });
      },

      outgoing(remote: string) {
        const conn = peer.connect(remote, { reliable: true });
        const id = conn.connectionId;
        state.change((d) => {
          d.connections.push({ kind: 'data', id, open: false, peer: { remote, local } });
        });
        conn.on('open', () => {
          state.change((d) => {
            const conn = Get.conn.item(d, id);
            if (conn) conn.open = true;
          });
        });
        DataConnection.monitor(conn);
      },

      incoming(conn: t.DataConnection) {
        const exists = Boolean(Get.conn.item(state.current, conn.connectionId));
        if (!exists) {
          const id = conn.connectionId;
          const remote = conn.peer;
          const peer = { remote, local };
          state.change((d) => d.connections.push({ kind: 'data', id, open: true, peer }));
          DataConnection.monitor(conn);
        }
      },
    } as const;

    /**
     * Peer events.
     */
    peer.on('open', () => state.change((d) => (d.open = true)));
    peer.on('close', () => state.change((d) => (d.open = false)));

    /**
     * Incoming data connection.
     */
    peer.on('connection', (conn) => DataConnection.incoming(conn));

    /**
     * Incoming media connection.
     */
    peer.on('call', (e) => {
      console.log('call', e);
    });

    /**
     * API
     */
    const api: t.PeerModel = {
      id: peer.id,
      events: (dispose$?: t.UntilObservable) => state.events(dispose$),
      get current() {
        return state.current;
      },
      connect: {
        data: (remotePeer: string) => DataConnection.outgoing(remotePeer),
      },
      disconnect(id) {
        Get.conn.object(state.current, id)?.close();
        api.purge();
      },
      purge() {
        state.change((d) => {
          d.connections = d.connections.filter((item) => {
            if (item.open === false) return false;
            if (Get.conn.object(d, item.id)?.open === false) return false;
            return true;
          });
        });
      },
    };
    return api;
  },
} as const;

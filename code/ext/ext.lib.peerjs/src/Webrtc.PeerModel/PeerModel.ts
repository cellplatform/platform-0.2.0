import { slug, PatchState, rx, type t } from './common';
import { events } from './PeerModel.events';
import { getFactory } from './PeerModel.get';

/**
 * Peer model.
 */
export const PeerModel = {
  /**
   * Wrap a PeerJS object with a stateful management model.
   */
  wrap(peer: t.PeerJs, dispose$?: t.UntilObservable) {
    const lifecycle = rx.lifecycle(dispose$);
    lifecycle.dispose$.subscribe(() => peer.destroy());

    const local = peer.id;
    const initial: t.Peer = { open: false, connections: [] };
    const state = PatchState.init<t.Peer, t.PeerModelEvents>({
      initial,
      events: ($, dispose$) => events($, [dispose$, lifecycle.dispose$]),
    });
    const dispatch = PatchState.Command.dispatcher<t.PeerModelCmd>(state);
    const toDispatchConnection = (conn: t.PeerJsConn) => {
      const id = conn.connectionId;
      const remote = conn.peer;
      return { id, peer: { local, remote } };
    };

    const Get = getFactory(peer);

    const PeerJsDataConn = {
      monitor(conn: t.PeerJsConnData) {
        const id = conn.connectionId;
        const connection = toDispatchConnection(conn);
        conn.on('data', (data) => {
          dispatch({ type: 'Peer:Data', payload: { tx: slug(), connection, data } });
        });
        conn.on('close', () => {
          state.change((d) => (d.connections = d.connections.filter((item) => item.id !== id)));
          api.disconnect(id);
        });
        conn.on('error', (error) => {
          // TODO 🐷
          // console.log('error data', conn, error);
          dispatch({
            type: 'Peer:Conn',
            payload: { tx: slug(), connection, action: 'error', error },
          });
        });
      },

      startOutgoing(remote: string) {
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
        PeerJsDataConn.monitor(conn);
        dispatch({
          type: 'Peer:Conn',
          payload: { tx: slug(), connection: toDispatchConnection(conn), action: 'start:out' },
        });
      },

      startIncoming(conn: t.PeerJsConnData) {
        const exists = Boolean(Get.conn.item(state.current, conn.connectionId));
        if (!exists) {
          const id = conn.connectionId;
          const remote = conn.peer;
          const peer = { remote, local };
          state.change((d) => d.connections.push({ kind: 'data', id, open: true, peer }));
          PeerJsDataConn.monitor(conn);
        }
        dispatch({
          type: 'Peer:Conn',
          payload: { tx: slug(), connection: toDispatchConnection(conn), action: 'start:in' },
        });
      },
    } as const;

    /**
     * Peer events.
     */
    peer.on('open', () => state.change((d) => (d.open = true)));
    peer.on('close', () => state.change((d) => (d.open = false)));
    peer.on('connection', (conn) => PeerJsDataConn.startIncoming(conn));

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
        data: (remotePeer: string) => PeerJsDataConn.startOutgoing(remotePeer),
      },

      disconnect(id) {
        const conn = api.get.connection(id);
        if (conn) {
          conn.close();
          dispatch({
            type: 'Peer:Conn',
            payload: { tx: slug(), connection: toDispatchConnection(conn), action: 'close' },
          });
        }
        api.purge();
      },

      purge() {
        let changed = false;
        state.change((d) => {
          const total = d.connections.length;
          d.connections = d.connections.filter((item) => {
            if (item.open === false) return false;
            if (Get.conn.object(d, item.id)?.open === false) return false;
            return true;
          });
          if (total !== d.connections.length) changed = true;
        });
        if (changed) {
          dispatch({ type: 'Peer:Conn', payload: { tx: slug(), action: 'total' } });
        }
      },

      get: {
        connection(id) {
          return Get.conn.object(state.current, id);
        },
        dataConnection(id) {
          return Get.conn.object(state.current, id, 'data') as t.PeerJsConnData;
        },
        mediaConnection(id) {
          return Get.conn.object(state.current, id, 'media') as t.PeerJsConnMedia;
        },
      },

      /**
       * Lifecycle
       */
      dispose: lifecycle.dispose,
      dispose$: lifecycle.dispose$,
      get disposed() {
        return lifecycle.disposed;
      },
    };
    return api;
  },
} as const;

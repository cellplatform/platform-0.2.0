import { DEFAULTS, PatchState, slug, Time, type t } from './common';
import { getFactory } from './PeerModel.get';
import { Wrangle } from './Wrangle';

export function manageDataConnection(args: {
  peer: t.PeerJs;
  model: t.PeerModel;
  state: t.PeerModelState;
}) {
  const { peer, state, model } = args;
  const self = peer.id;
  const dispatch = PatchState.Command.dispatcher<t.PeerModelCmd>(state);
  const Get = getFactory(peer);

  const api = {
    dispatch: {
      connection(action: t.PeerModelConnAction, conn?: t.PeerJsConn, error?: string) {
        const connection = conn ? Wrangle.dispatchConnection(self, conn) : undefined;
        dispatch({
          type: 'Peer:Connection',
          payload: { tx: slug(), connection, action, error },
        });
      },
      purge() {
        dispatch({ type: 'Peer:Purge', payload: { tx: slug() } });
      },
    },

    monitor(conn: t.PeerJsConnData) {
      const id = conn.connectionId;
      const connection = Wrangle.dispatchConnection(self, conn);
      conn.on('data', (data) => {
        dispatch({ type: 'Peer:Data', payload: { tx: slug(), connection, data } });
      });
      conn.on('close', () => {
        state.change((d) => (d.connections = d.connections.filter((item) => item.id !== id)));
        model.disconnect(id);
        api.dispatch.connection('closed', conn);
      });
      conn.on('error', (err) => api.dispatch.connection('error', conn, err.message));
    },

    start: {
      /**
       * Start an outgoing data connection.
       */
      outgoing(remote: string, options: { timeout?: t.Milliseconds } = {}) {
        return new Promise<t.PeerConnectedData>((resolve) => {
          const { timeout = DEFAULTS.connectionTimeout } = options;

          const conn = peer.connect(remote, { reliable: true });
          const id = conn.connectionId;
          state.change((d) => {
            const peer = { self, remote };
            d.connections.push({ kind: 'data', id, open: null, peer });
          });

          const handleOpen = () =>
            state.change((d) => {
              timer.cancel();
              const item = Get.conn.item(d, id);
              if (!item) return handleFailure('failed to retrieve connection model');
              item.open = true;
              api.dispatch.connection('ready', conn);
              resolve({ id, conn });
            });

          const handleFailure = (error: string) =>
            state.change((d) => {
              const item = Get.conn.item(d, id);
              if (item) item.open = false;
              api.dispatch.connection('error', conn, error);
              resolve({ id, conn, error });
            });

          conn.on('open', handleOpen);
          api.monitor(conn);
          api.dispatch.connection('start:out', conn);
          const timer = Time.delay(timeout, () => handleFailure('timed out while connecting'));
        });
      },

      /**
       * Start an incoming data connection.
       */
      incoming(conn: t.PeerJsConnData) {
        const exists = Get.conn.exists(state.current, conn.connectionId);
        if (!exists) {
          const id = conn.connectionId;
          const remote = conn.peer;
          const peer = { self, remote };
          state.change((d) => d.connections.push({ kind: 'data', id, open: true, peer }));
          api.monitor(conn);
        }
        api.dispatch.connection('start:in', conn);
        api.dispatch.connection('ready', conn);
      },
    },
  } as const;

  return api;
}

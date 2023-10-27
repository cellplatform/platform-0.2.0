import { getFactory } from './PeerModel.get';
import { DEFAULTS, Time, slug, type t } from './common';
import { Dispatch } from './u.Dispatch';
import { Wrangle } from './u.Wrangle';

type Id = string;

export function manageDataConnection(args: {
  peerjs: t.PeerJs;
  model: t.PeerModel;
  state: t.PeerModelState;
}) {
  const { peerjs, model, state } = args;
  const self = peerjs.id;
  const Get = getFactory(peerjs);
  const dispatch = Dispatch.common(model);

  const api = {
    start: {
      /**
       * Start an outgoing data connection.
       */
      outgoing(remote: Id) {
        return new Promise<t.PeerConnectedData>((resolve) => {
          const metadata: t.PeerConnectMetadata = { kind: 'data', useragent: navigator.userAgent };
          const conn = peerjs.connect(remote, { reliable: true, metadata });
          const id = conn.connectionId;
          state.change((d) => {
            d.connections.push({
              kind: 'data',
              id,
              peer: { self, remote },
              open: null,
              metadata,
              direction: 'outgoing',
            });
          });

          const handleOpen = () =>
            state.change((d) => {
              timer.cancel();
              const item = Get.conn.item(d, id);
              if (!item) return handleFailure('failed to retrieve connection model');
              item.open = true;
              dispatch.connection('ready', conn);
              resolve({ id, conn });
            });

          const handleFailure = (error: string) =>
            state.change((d) => {
              const item = Get.conn.item(d, id);
              if (item) item.open = false;
              dispatch.connection('error', conn, error);
              resolve({ id, conn, error });
            });

          conn.on('open', handleOpen);
          api.monitor(conn);
          dispatch.connection('start:out', conn);
          const timeout = DEFAULTS.connectionTimeout;
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
          state.change((d) =>
            d.connections.push({
              id,
              kind: 'data',
              open: true,
              peer,
              metadata: Wrangle.metadata(conn),
              direction: 'incoming',
            }),
          );
          api.monitor(conn);
        }
        dispatch.connection('start:in', conn);
        dispatch.connection('ready', conn);
      },
    },

    monitor(conn: t.PeerJsConnData) {
      const id = conn.connectionId;
      const connection = Wrangle.dispatchConnection(self, conn);

      conn.on('data', (data) => {
        model.dispatch({
          type: 'Peer:Data',
          payload: { tx: slug(), connection, data },
        });
      });

      conn.on('close', () => {
        state.current.connections
          .filter(({ kind }) => kind === 'media:video' || kind === 'media:screen')
          .filter(({ peer }) => peer.remote === conn.peer)
          .forEach(({ id }) => model.disconnect(id)); // Close child-media connections.

        state.change((d) => (d.connections = d.connections.filter((item) => item.id !== id)));
        model.disconnect(id);
        dispatch.connection('closed', conn);
      });

      conn.on('error', (err) => dispatch.connection('error', conn, err.message));
    },
  } as const;

  return api;
}
import { Dispatch } from './Dispatch';
import { getFactory } from './PeerModel.get';
import { Wrangle } from './Wrangle';
import { DEFAULTS, Time, type t } from './common';

type Id = string;

export function manageMediaConnection(args: {
  peerjs: t.PeerJs;
  model: t.PeerModel;
  state: t.PeerModelState;
}) {
  const { peerjs, state, model } = args;
  const self = peerjs.id;
  const Get = getFactory(peerjs);
  const dispatch = Dispatch.common(model);

  const api = {
    start: {
      /**
       * Start an outgoing data connection.
       */
      async outgoing(mediaKind: t.PeerMediaKind, remote: Id) {
        return new Promise<t.PeerConnectedMedia>(async (resolve) => {
          const existingDataConn = model.current.connections
            .filter((item) => item.kind === 'data')
            .find((item) => item.peer.remote === remote);
          if (!existingDataConn) {
            const error = 'media connection requires data first';
            dispatch.connection('error', undefined, error);
            return resolve({ id: '', error });
          }

          const kind: t.PeerConnectionKind = mediaKind === 'video' ? 'media:video' : 'media:screen';
          const metadata: t.PeerConnectMetadata = { kind, useragent: navigator.userAgent };
          const localstream = await model.get.media.videostream();
          const conn = peerjs.call(remote, localstream, { metadata });
          const id = conn.connectionId;
          state.change((d) => {
            d.connections.push({
              kind,
              id,
              peer: { self, remote },
              open: null,
              metadata,
              stream: { self: localstream },
              direction: 'outgoing',
            });
          });
          dispatch.connection('start:out', conn);
          api.monitor(conn, localstream, resolve);
        });
      },

      /**
       * Start an incoming media connection ("call")
       */
      async incoming(conn: t.PeerJsConnMedia) {
        const metadata = Wrangle.metadata(conn);
        if (!(metadata.kind === 'media:video' || metadata.kind === 'media:screen')) {
          const message = `Failed to establish incoming call. Incoming connnection not of type "media".`;
          dispatch.error(message);
          return;
        }

        const kind = metadata.kind as t.PeerConnectionKind;
        const id = conn.connectionId;
        const remote = conn.peer;
        const localstream = await model.get.media.videostream();

        const exists = Get.conn.exists(state.current, conn.connectionId);
        if (!exists) {
          state.change((d) =>
            d.connections.push({
              kind,
              id,
              peer: { self, remote },
              open: null,
              metadata,
              stream: { self: localstream },
              direction: 'incoming',
            }),
          );
        }

        api.monitor(conn, localstream);
        conn.answer(localstream);
        dispatch.connection('start:in', conn);
      },
    },

    monitor(
      conn: t.PeerJsConnMedia,
      localstream: MediaStream,
      resolve?: (e: t.PeerConnectedMedia) => void,
    ) {
      const id = conn.connectionId;

      const handleOpen = (remote: MediaStream) => {
        timer.cancel();
        state.change((d) => {
          const item = Get.conn.item(d, id);
          if (item) {
            const media = item.stream || (item.stream = { self: localstream });
            media.remote = remote;
            item.open = true;
          }
        });
        dispatch.connection('ready', conn);
        resolve?.({ id });
      };

      const handleFailure = (error: string) =>
        state.change((d) => {
          const item = Get.conn.item(d, id);
          if (item) item.open = false;
          dispatch.connection('error', conn, error);
          resolve?.({ id, error });
        });

      conn.on('stream', (remote) => handleOpen(remote));
      const timeout = DEFAULTS.connectionTimeout;
      const timer = Time.delay(timeout, () => handleFailure('timed out while connecting media'));
    },
  } as const;

  return api;
}

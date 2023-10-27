import { getFactory } from './PeerModel.get';
import { DEFAULTS, Time, type t } from './common';
import { Dispatch } from './u.Dispatch';
import { Stream } from './u.Stream';
import { Wrangle } from './u.Wrangle';

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

  const getStream = (kind: t.PeerConnectionMediaKind) => {
    if (kind === 'media:video') return model.get.stream.video();
    if (kind === 'media:screen') return model.get.stream.screen();
    throw new Error(`media kind "${kind}" not supported`);
  };

  const api = {
    start: {
      /**
       * Start an outgoing data connection.
       */
      async outgoing(media: t.PeerConnectionMediaKind, remote: Id) {
        return new Promise<t.PeerConnectedMedia>(async (resolve) => {
          const existingDataConn = model.current.connections
            .filter((item) => item.kind === 'data')
            .find((item) => item.peer.remote === remote);
          if (!existingDataConn) {
            const error = 'media connection requires data first';
            dispatch.connection('error', undefined, error);
            return resolve({ id: '', error });
          }

          const kind: t.PeerConnectionKind =
            media === 'media:video' ? 'media:video' : 'media:screen';
          const metadata: t.PeerConnectMetadata = { kind, useragent: navigator.userAgent };
          const localstream = await getStream(media);
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
          api.monitor(media, 'outgoing', conn, localstream, resolve);
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
        const media: t.PeerConnectionMediaKind =
          kind === 'media:screen' ? 'media:screen' : 'media:video';
        const id = conn.connectionId;
        const remote = conn.peer;
        const localstream = media === 'media:video' ? await model.get.stream.video() : undefined;

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

        api.monitor(media, 'incoming', conn, localstream);
        conn.answer(localstream);
        dispatch.connection('start:in', conn);
      },
    },

    monitor(
      media: t.PeerConnectionMediaKind,
      direction: t.PeerConnectDirection,
      conn: t.PeerJsConnMedia,
      localstream?: MediaStream,
      resolve?: (e: t.PeerConnectedMedia) => void,
    ) {
      const id = conn.connectionId;

      /**
       * The screen share may be closed externally within the host OS.
       */
      const monitorExternalScreenshareClose = (stream: MediaStream) => {
        Stream.onEnded(stream, () => {
          const item = model.current.connections.find((item) => item.id === id);
          if (item) model.disconnect(item.id);
        });
      };

      const Handle = {
        open(remotestream?: MediaStream) {
          timer?.cancel();
          state.change((d) => {
            const item = Get.conn.item(d, id);
            if (item) {
              const media = item.stream || (item.stream = { self: localstream });
              media.remote = remotestream;
              item.open = true;
            }
          });
          if (media === 'media:screen' && localstream) monitorExternalScreenshareClose(localstream);
          dispatch.connection('ready', conn);
          resolve?.({ id });
        },

        close() {
          state.change((d) => (d.connections = d.connections.filter((item) => item.id !== id)));
          model.disconnect(id);
          dispatch.connection('closed', conn);
        },

        failure(error: string) {
          state.change((d) => {
            const item = Get.conn.item(d, id);
            if (item) item.open = false;
            dispatch.connection('error', conn, error);
            resolve?.({ id, error });
          });
        },
      };

      const msecs = DEFAULTS.connectionTimeout;
      const timer = Time.delay(msecs, () => {
        Handle.failure('timed out while connecting media');
      });

      if (media === 'media:video') {
        conn.on('stream', (remote) => Handle.open(remote));
      }
      if (media === 'media:screen') {
        if (direction === 'outgoing') Handle.open();
        if (direction === 'incoming') conn.on('stream', (remote) => Handle.open(remote));
      }
      conn.on('close', () => Handle.close());
      conn.on('error', (err) => dispatch.connection('error', conn, err.message));
    },
  } as const;

  return api;
}

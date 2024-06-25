import { DEFAULTS, PeerIs, Time, type t } from './common';
import { Dispatch } from './u.Dispatch';
import { Stream } from './u.Stream';
import { Wrangle } from './u.Wrangle';
import { getFactory } from './u.get';

type Id = string;

export function manageMediaConnection(args: {
  peerjs: t.PeerJs;
  model: t.PeerModel;
  state: t.PeerModelState;
}) {
  const { peerjs, state, model } = args;
  const self = peerjs.id;
  const get = getFactory(peerjs);
  const dispatch = Dispatch.common(model);

  const api = {
    start: {
      /**
       * Start an outgoing data connection.
       */
      async outgoing(kind: t.PeerConnectionKindMedia, remote: Id) {
        return new Promise<t.PeerConnectedMedia>(async (resolve) => {
          const resolveError = (error: string) => {
            dispatch.connection('error', undefined, error);
            const res = { id: '', error };
            return resolve(res);
          };

          const parentData = model.current.connections
            .filter((item) => item.kind === 'data')
            .find((item) => item.peer.remote === remote);
          if (!parentData) {
            return resolveError('media connection requires data first');
          }

          const media = await model.get.media(kind);
          const stream = media.stream;
          if (!stream) {
            const error = 'Could not get outgoing media stream';
            return resolveError(error);
          }

          const metadata = await dispatch.beforeOutgoing(kind, self, remote);
          const conn = peerjs.call(remote, stream, { metadata });
          state.change((d) => {
            d.connections.push({
              kind,
              id: conn.connectionId,
              peer: { self, remote },
              metadata,
              stream: { self: stream },
              direction: 'outgoing',
              open: null,
            });
          });

          api.monitor(kind, 'outgoing', conn, stream, resolve);
          dispatch.connection('start:out', conn);
        });
      },

      /**
       * Start an incoming media connection ("call")
       */
      async incoming(conn: t.PeerJsConnMedia) {
        const metadata = Wrangle.metadata(conn);

        if (!PeerIs.Kind.media(metadata.kind)) {
          const message = `Failed to establish incoming call. Connnection not of type "media".`;
          dispatch.error(message);
          return;
        }

        const kind = metadata.kind as t.PeerConnectionKindMedia;
        const id = conn.connectionId;
        const remote = conn.peer;

        let media: t.GetMediaResponse | undefined;
        if (kind === 'media:video') media = await model.get.media('media:video'); // NB: starting a response screen-share not required!
        const stream = media?.stream;

        const exists = get.conn.exists(state.current, conn.connectionId);
        if (!exists) {
          state.change((d) =>
            d.connections.push({
              kind,
              id,
              peer: { self, remote },
              metadata,
              stream: { self: stream },
              direction: 'incoming',
              open: null,
            }),
          );
        }

        api.monitor(kind, 'incoming', conn, stream);
        conn.answer(stream);
        dispatch.connection('start:in', conn);
      },
    },

    monitor(
      media: t.PeerConnectionKindMedia,
      direction: t.IODirection,
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
            const item = get.conn.item(d, id);
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
            const item = get.conn.item(d, id);
            if (item) item.open = false;
            dispatch.connection('error', conn, error);
            resolve?.({ id, error });
          });
        },
      } as const;

      const msecs = DEFAULTS.connectionTimeout;
      const timer = Time.delay(msecs, () => Handle.failure('timed out while connecting media'));

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

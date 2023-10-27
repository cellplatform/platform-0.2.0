import { PeerJs } from '../Webrtc.PeerJs/PeerJs';
import { manageDataConnection } from './PeerModel.Conn.Data';
import { manageMediaConnection } from './PeerModel.Conn.Media';
import { eventFactory } from './PeerModel.events';
import { getFactory } from './PeerModel.get';
import { PatchState, rx, type t } from './common';
import { Dispatch } from './u.Dispatch';
import { Stream } from './u.Stream';

/**
 * Peer model.
 */
export const PeerModel: t.WebrtcPeerModel = {
  /**
   * Iniitalize a new PeerJS peer wrapped in an observable Model.
   */
  init(options = {}) {
    const { dispose$, host, path, key, peerid = '' } = options;
    const peer = PeerJs.create(peerid, { host, path, key });
    return PeerModel.wrap(peer, dispose$);
  },

  /**
   * Wrap a PeerJS object with a stateful management model.
   */
  wrap(peerjs, dispose$) {
    const lifecycle = rx.lifecycle(dispose$);
    lifecycle.dispose$.subscribe(() => peerjs.destroy());

    const Get = getFactory(peerjs);
    const initial: t.Peer = { open: false, connections: [] };
    const state: t.PeerModelState = PatchState.init<t.Peer, t.PeerModelEvents>({
      initial,
      events: ($, dispose$) => eventFactory($, [dispose$, lifecycle.dispose$]),
    });

    /**
     * Internal Model Events.
     */
    const events = state.events();
    events.cmd.purge$.subscribe(() => model.purge());

    /**
     * PeerJS Events.
     */
    peerjs.on('open', () => state.change((d) => (d.open = true)));
    peerjs.on('close', () => state.change((d) => (d.open = false)));
    peerjs.on('connection', (conn) => Data.start.incoming(conn));
    peerjs.on('call', (conn) => Media.start.incoming(conn));

    /**
     * Media streams.
     */
    let _videostream: MediaStream | undefined;
    let _screenstream: MediaStream | undefined;
    const releaseWhenLastStream = (kind: t.PeerConnectionKind, stream?: MediaStream) => {
      if (Get.conn.byKind(model.current, kind).length > 0) return stream;
      Stream.stop(stream);
      return undefined;
    };

    /**
     * API
     */
    const model: t.PeerModel = {
      id: peerjs.id,
      dispatch: PatchState.Command.dispatcher<t.PeerModelCmd>(state),
      events: (dispose$?: t.UntilObservable) => state.events(dispose$),
      get current() {
        return state.current;
      },

      connect: {
        data: (remoteid) => Data.start.outgoing(remoteid),
        media: (kind, remoteid) => Media.start.outgoing(kind, remoteid),
      },

      disconnect(id) {
        if (!id) return;
        model.get.conn.obj(id)?.close();
        model.purge();
      },

      purge() {
        // Walk connections.
        const before = state.current.connections.length;
        state.change((d) => {
          d.connections = d.connections.filter((item) => {
            if (item.open === false) return false;
            if (Get.conn.object(d, item.id)?.open === false) return false;
            return true;
          });
        });

        // Release media streams.
        _videostream = releaseWhenLastStream('media:video', _videostream);
        _screenstream = releaseWhenLastStream('media:screen', _screenstream);

        // Finish up.
        const after = state.current.connections.length;
        const changed = before !== after;
        if (changed) dispatch.connection('purged');
        return { changed, total: { before, after } };
      },

      get: {
        conn: {
          obj: (id) => Get.conn.object(state.current, id),
          data(id) {
            type T = t.PeerJsConnData;
            return Get.conn.object(state.current, id, 'data') as T;
          },
          media(id) {
            type T = t.PeerJsConnMedia;
            return Get.conn.object(state.current, id, 'media:video', 'media:screen') as T;
          },
          video(id) {
            type T = t.PeerJsConnMedia;
            return Get.conn.object(state.current, id, 'media:video') as T;
          },
          screen(id) {
            type T = t.PeerJsConnMedia;
            return Get.conn.object(state.current, id, 'media:screen') as T;
          },
        },
        stream: {
          async video() {
            return _videostream || (_videostream = await Stream.getVideo());
          },
          async screen() {
            return _screenstream || (_screenstream = await Stream.getScreen());
          },
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

    const dispatch = Dispatch.common(model);
    const Data = manageDataConnection({ peerjs, model, state });
    const Media = manageMediaConnection({ peerjs, model, state });
    return model;
  },
};

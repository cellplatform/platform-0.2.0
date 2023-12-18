import { PatchState, rx, type t } from './common';

import { PeerJs } from '../Webrtc.PeerJs/PeerJs';
import { manageDataConnection } from './PeerModel.Conn.Data';
import { manageMediaConnection } from './PeerModel.Conn.Media';
import { eventFactory } from './PeerModel.events';
import { Dispatch } from './u.Dispatch';
import { Stream } from './u.Stream';
import { getFactory } from './u.get';

/**
 * Peer model.
 */
export const PeerModel: t.WebrtcPeer = {
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
    const life = rx.lifecycle(dispose$);
    life.dispose$.subscribe(() => peerjs.destroy());

    const get = getFactory(peerjs);
    const initial: t.Peer = { open: false, connections: [] };
    const state: t.PeerModelState = PatchState.init<t.Peer, t.PeerModelEvents>({
      initial,
      events: ($, dispose$) => eventFactory($, [dispose$, life.dispose$]),
    });

    /**
     * Internal Model Events.
     */
    const events = state.events();
    events.cmd.purge$.subscribe(() => model.purge());

    /**
     * Media Streams.
     */
    const streams = Stream.memoryState(peerjs, state);

    /**
     * PeerJS Events.
     */
    peerjs.on('open', () => state.change((d) => (d.open = true)));
    peerjs.on('close', () => state.change((d) => (d.open = false)));
    peerjs.on('connection', (conn) => Data.start.incoming(conn));
    peerjs.on('call', (conn) => Media.start.incoming(conn));

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

      get iceServers() {
        // ICE: Interactive Connectivity Establishment
        return peerjs.options.config.iceServers;
      },

      connect: {
        data: (remoteid) => Data.start.outgoing(remoteid),
        media: (kind, remoteid) => Media.start.outgoing(kind, remoteid),
      },

      disconnect(connid) {
        if (connid) {
          model.get.conn.obj(connid)?.close();
          model.purge();
        } else {
          model.current.connections.forEach((conn) => model.disconnect(conn.id));
        }
      },

      purge() {
        // Walk connections.
        const before = state.current.connections.length;
        state.change((d) => {
          d.connections = d.connections.filter((item) => {
            if (item.open === false) return false;
            if (get.conn.peerjs(d, item.id)?.open === false) return false;
            return true;
          });
        });

        // Release media streams.
        streams.purge();

        // Finish up.
        const after = state.current.connections.length;
        const changed = before !== after;
        if (changed) dispatch.connection('purged');
        return { changed, total: { before, after } };
      },

      get: {
        conn: {
          get remotes() {
            return get.conn.byRemote(model.current);
          },
          obj: get.conn.objFactory(state),
          item: (id = '') => state.current.connections.find((item) => item.id === id),
        },
        media(kind) {
          if (kind === 'media:video') return streams.video();
          if (kind === 'media:screen') return streams.screen();
          throw new Error(`Kind "${kind}" not supported`);
        },
      },

      /**
       * Lifecycle.
       */
      dispose: life.dispose,
      dispose$: life.dispose$,
      get disposed() {
        return life.disposed;
      },
    };

    const dispatch = Dispatch.common(model);
    const Data = manageDataConnection({ peerjs, model, state });
    const Media = manageMediaConnection({ peerjs, model, state });
    return model;
  },
};

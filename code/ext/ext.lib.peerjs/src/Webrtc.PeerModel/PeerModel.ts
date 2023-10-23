import { PeerJs } from '../Webrtc.PeerJs/PeerJs';
import { manageDataConnection } from './PeerModel.DataConnection';
import { events } from './PeerModel.events';
import { getFactory } from './PeerModel.get';
import { PatchState, rx, type t } from './common';

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
  wrap(peer, dispose$) {
    const lifecycle = rx.lifecycle(dispose$);
    lifecycle.dispose$.subscribe(() => peer.destroy());

    const Get = getFactory(peer);
    const initial: t.Peer = { open: false, connections: [] };
    const state: t.PeerModelState = PatchState.init<t.Peer, t.PeerModelEvents>({
      initial,
      events: ($, dispose$) => events($, [dispose$, lifecycle.dispose$]),
    });

    /**
     * Peer events.
     */
    peer.on('open', () => state.change((d) => (d.open = true)));
    peer.on('close', () => state.change((d) => (d.open = false)));
    peer.on('connection', (conn) => Data.start.incoming(conn));

    /**
     * Incoming media connection.
     */
    peer.on('call', (e) => {
      /**
       * TODO 🐷 Media Connections
       */
      console.log('call', e);
    });

    /**
     * API
     */
    const model: t.PeerModel = {
      id: peer.id,
      events: (dispose$?: t.UntilObservable) => state.events(dispose$),
      get current() {
        return state.current;
      },

      connect: {
        data(remotePeer: string) {
          return Data.start.outgoing(remotePeer);
        },
      },

      disconnect(id) {
        const conn = model.get.connection(id);
        if (conn) {
          conn.close();
          Data.dispatch.connection('close', conn);
        }
        model.purge();
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
        if (changed) Data.dispatch.connection('purge');
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

    const Data = manageDataConnection({ peer, model, state });
    return model;
  },
};

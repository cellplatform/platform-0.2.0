import { cuid, R, t } from './common';
import { waitFor } from './util.$.mjs';

export const Util = {
  waitFor,

  randomPeerId() {
    return `p${cuid()}`;
  },

  asId(input: string) {
    input = (input || '').trim();
    input = input.replace(/^peer\:/, '');
    return input.trim();
  },

  asUri(id: string) {
    return `peer:${Util.asId(id)}`;
  },

  toDataPayload(conn: t.PeerDataConnection, event: t.Event<any>): t.PeerDataPayload {
    const peer = conn.peer.local;
    const connection = conn.id;
    return { source: { peer, connection }, event };
  },

  isType: {
    PeerDataPayload(input: any) {
      if (typeof input !== 'object') return false;

      const data = input as t.PeerDataPayload;
      if (typeof data.source !== 'object') return false;
      if (typeof data.source.peer !== 'string') return false;
      if (typeof data.source.connection !== 'string') return false;
      if (typeof data.event !== 'object') return false;
      if (typeof data.event.type !== 'string') return false;
      if (typeof data.event.payload !== 'object') return false;

      return true;
    },
  },

  connections: {
    toSet(input: t.PeerConnection[] | (() => t.PeerConnection[])): t.PeerConnections {
      const fn = typeof input === 'function' ? input : () => input;
      return {
        get length() {
          return fn().length;
        },
        get all() {
          return fn();
        },
        get data() {
          return Util.filter.onDataConnection(fn());
        },
        get media() {
          return Util.filter.onMediaConnection(fn());
        },
      };
    },
    byPeer(connections: t.PeerConnection[]): t.PeerConnectionsByPeer[] {
      const byPeer = R.groupBy((item) => item.peer.remote, connections);
      return Object.entries(byPeer).map(([peer, all]) => {
        const item: t.PeerConnectionsByPeer = {
          peer,
          length: all.length,
          all,
          get data() {
            return Util.filter.onDataConnection(all);
          },
          get media() {
            return Util.filter.onMediaConnection(all);
          },
        };
        return item;
      });
    },
  },

  filter: {
    onConnectionKind<C extends t.PeerConnection>(kind: C['kind'], source: t.PeerConnection[]) {
      return source.filter((conn) => conn.kind === kind) as C[];
    },

    onDataConnection(source: t.PeerConnection[]) {
      return Util.filter.onConnectionKind<t.PeerDataConnection>('data', source);
    },

    onMediaConnection(source: t.PeerConnection[]) {
      return Util.filter.onConnectionKind<t.PeerMediaConnection>('media', source);
    },
  },
};

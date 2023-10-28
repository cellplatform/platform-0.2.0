import { type t } from './common';

type K = t.PeerConnectionKind;

export function getFactory(peerjs: t.PeerJs) {
  const api = {
    conn: {
      peerjs(peer: t.Peer, id: string, ...match: K[]) {
        const item = api.conn.item(peer, id);
        if (item?.kind && match.length > 0 && !match.includes(item.kind)) return undefined;
        return item ? peerjs.getConnection(item.peer.remote, id) || undefined : undefined;
      },
      exists(peer: t.Peer, id: string) {
        return Boolean(api.conn.item(peer, id));
      },
      item(peer: t.Peer, id: string) {
        return peer.connections.find((item) => item.id === id);
      },
      itemsByKind(peer: t.Peer, ...match: K[]) {
        return peer.connections.filter((item) => match.includes(item.kind));
      },
      byRemote(peer: t.Peer): t.PeerConnectionsByPeer {
        return peer.connections.reduce((acc, next) => {
          const list = acc[next.peer.remote] ?? (acc[next.peer.remote] = []);
          list.push(next);
          return acc;
        }, {} as t.PeerConnectionsByPeer);
      },
      objFactory(state: t.PeerModelState) {
        type C = t.PeerJsConn;
        type D = t.PeerJsConnData;
        type M = t.PeerJsConnMedia;
        const get = <T extends C>(id: string, ...match: K[]) =>
          api.conn.peerjs(state.current, id, ...match) as T;
        const fn: t.PeerModelGetConnectionObject = (id) => get(id);
        fn.data = (id) => get<D>(id, 'data');
        fn.media = (id) => get<M>(id, 'media:video', 'media:screen');
        fn.video = (id) => get<M>(id, 'media:video');
        fn.screen = (id) => get<M>(id, 'media:screen');
        return fn;
      },
    },
  } as const;
  return api;
}

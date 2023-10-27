import { type t } from './common';

export function getFactory(peerjs: t.PeerJs) {
  const api = {
    conn: {
      peerjs(peer: t.Peer, id: string, ...match: t.PeerConnectionKind[]) {
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
      itemsByKind(peer: t.Peer, ...match: t.PeerConnectionKind[]) {
        return peer.connections.filter((item) => match.includes(item.kind));
      },
      obj(state: t.PeerModelState) {
        type D = t.PeerJsConnData;
        type M = t.PeerJsConnMedia;
        const conn = api.conn;
        const fn: t.PeerModelGetConnectionObject = (id) => conn.peerjs(state.current, id);
        fn.data = (id) => conn.peerjs(state.current, id, 'data') as D;
        fn.media = (id) => conn.peerjs(state.current, id, 'media:video', 'media:screen') as M;
        fn.video = (id) => conn.peerjs(state.current, id, 'media:video') as M;
        fn.screen = (id) => conn.peerjs(state.current, id, 'media:screen') as M;
        return fn;
      },
    },
  } as const;
  return api;
}

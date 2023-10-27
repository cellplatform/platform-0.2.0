import { type t } from './common';

export function getFactory(peer: t.PeerJs) {
  const api = {
    conn: {
      exists(s: t.Peer, id: string) {
        return Boolean(api.conn.item(s, id));
      },
      item(s: t.Peer, id: string) {
        return s.connections.find((item) => item.id === id);
      },
      object(s: t.Peer, id: string, ...match: t.PeerConnectionKind[]) {
        const item = api.conn.item(s, id);
        if (item?.kind && match.length > 0 && !match.includes(item.kind)) return undefined;
        return item ? peer.getConnection(item.peer.remote, id) || undefined : undefined;
      },
      byKind(s: t.Peer, ...match: t.PeerConnectionKind[]) {
        return s.connections.filter((item) => match.includes(item.kind));
      },
    },
  } as const;

  return api;
}

import { type t } from './common';

export function getFactory(peer: t.PeerJs) {
  const api = {
    conn: {
      exists: (s: t.Peer, id: string) => Boolean(api.conn.item(s, id)),
      item: (s: t.Peer, id: string) => s.connections.find((item) => item.id === id),
      object(s: t.Peer, id: string, ...match: t.PeerConnection['kind'][]) {
        const item = api.conn.item(s, id);
        if (item?.kind && match.length > 0 && !match.includes(item.kind)) return undefined;
        return item ? peer.getConnection(item.peer.remote, id) || undefined : undefined;
      },
    },
  } as const;

  return api;
}

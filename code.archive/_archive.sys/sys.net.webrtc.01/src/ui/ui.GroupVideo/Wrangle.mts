import { type t } from './common';

export const Wrangle = {
  selectedStream(self?: t.Peer, peerid?: t.PeerId) {
    if (!self) return undefined;

    const isSelf = self.id === peerid;
    const conns = Wrangle.mediaConnections(self, peerid);
    const conn = conns[0]; // NB: First connection (TODO: select other stream, such as screen-share)

    if (!conn) return undefined;
    return isSelf ? conn.stream.local : conn.stream.remote;
  },

  mediaConnections(self: t.Peer, peerid?: t.PeerId) {
    type T = t.PeerConnectionsByPeer;
    const isSelf = self.id === peerid;
    const isMatch = (conn: T) => peerid === (isSelf ? conn.peer.local : conn.peer.remote);
    return self.connectionsByPeer.find((conn) => isMatch(conn))?.media ?? [];
  },
};

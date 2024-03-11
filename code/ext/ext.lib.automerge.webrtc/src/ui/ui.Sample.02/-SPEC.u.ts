import { Peer, type t } from './common';

export const findMediaStream = (peers: t.PeerModel[], id?: string) => {
  if (!id) return;
  const isMedia = Peer.Is.kind.media;
  for (const peer of peers) {
    const media = peer.current.connections.filter((conn) => isMedia(conn.kind));
    for (const conn of media) {
      if (conn.stream?.self?.id === id) return conn.stream.self;
      if (conn.stream?.remote?.id === id) return conn.stream.remote;
    }
  }
  return;
};

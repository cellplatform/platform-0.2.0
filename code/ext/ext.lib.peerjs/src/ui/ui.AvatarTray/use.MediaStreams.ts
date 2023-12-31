import { useEffect, useState } from 'react';
import { WebrtcIs, type t } from './common';

export function useMediaStreams(peer?: t.PeerModel) {
  const [self, setSelf] = useState<MediaStream>();
  const [streams, setStreams] = useState<MediaStream[]>([]);

  useEffect(() => {
    const update = () => {
      if (!peer) return;
      const connections = peer.current.connections;
      const media = connections.filter((conn) => WebrtcIs.kind.media(conn.kind));
      const streams = media.map((conn) => Wrangle.stream(conn)).filter(Boolean);
      setStreams(() => streams);
      setSelf(Wrangle.self(peer));
    };

    const events = peer?.events();
    events?.cmd.conn$.subscribe(update);
    return events?.dispose;
  }, [peer?.id]);

  /**
   * API
   */
  return {
    streamids: [self?.id, ...streams.map(({ id }) => id)].filter(Boolean),
    self,
    streams,
  } as const;
}

/**
 * Helpers
 */
export const Wrangle = {
  stream(conn: t.PeerConnection) {
    let stream = conn.stream?.remote;
    if (!stream && conn.kind === 'media:screen') return conn.stream?.self!; // NB: screen-shares are only one way - show on both sides.
    return stream!;
  },

  self(peer: t.PeerModel) {
    const connections = peer?.current.connections ?? [];
    return connections
      .filter((conn) => conn.kind === 'media:video')
      .filter((conn) => conn.stream?.self)
      .map((conn) => conn.stream?.self)[0];
  },
} as const;

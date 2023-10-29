import { useEffect, useState } from 'react';
import { Is, type t } from './common';

export function useMediaStreams(peer?: t.PeerModel) {
  const [streams, setStreams] = useState<{ conn: t.PeerConnection; stream: MediaStream }[]>([]);

  useEffect(() => {
    const update = () => {
      if (!peer) return;
      const connections = peer.current.connections;
      const media = connections.filter((conn) => Is.kind.media(conn.kind));
      const streams = media
        .map((conn) => ({ conn, stream: Wrangle.stream(conn) }))
        .filter((item) => Boolean(item.stream));
      setStreams(() => streams);
    };

    const events = peer?.events();
    events?.cmd.conn$.subscribe(update);
    return events?.dispose;
  }, [peer?.id]);

  return { streams } as const;
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
} as const;

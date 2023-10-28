import { type t } from './common';

type Id = string;

/**
 * Helpers
 */
export const Wrangle = {
  dispatchConnection(self: Id, conn: t.PeerJsConn): t.PeerConnectionId {
    const id = conn.connectionId;
    const remote = conn.peer;
    return { id, peer: { self, remote } };
  },

  metadata(conn: t.PeerJsConn): t.PeerConnectMetadata {
    if (!conn.metadata) return { kind: 'unknown', userAgent: '' };
    return conn.metadata as t.PeerConnectMetadata;
  },
} as const;

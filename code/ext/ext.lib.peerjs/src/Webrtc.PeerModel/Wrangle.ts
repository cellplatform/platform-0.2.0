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
} as const;

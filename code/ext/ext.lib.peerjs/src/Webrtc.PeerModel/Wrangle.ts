import { type t } from './common';

/**
 * Helpers
 */
export const Wrangle = {
  dispatchConnection(local: string, conn: t.PeerJsConn) {
    const id = conn.connectionId;
    const remote = conn.peer;
    return { id, peer: { local, remote } };
  },
} as const;

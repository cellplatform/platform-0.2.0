import { t } from './common';
import { connections, isAlive } from './util.connections.mjs';
import { error } from './util.error.mjs';
import { filter } from './util.filter.mjs';
import { identity } from './util.identity.mjs';
import { isType } from './util.isType.mjs';
import { waitFor } from './util.waitFor.mjs';

export const WebRtcUtils = {
  ...identity,

  waitFor,
  filter,
  connections,
  isAlive,
  isType,
  error,

  toDataPayload(conn: t.PeerDataConnection, event: t.Event<any>): t.PeerDataPayload {
    const peer = conn.peer.local;
    const connection = conn.id;
    return { source: { peer, connection }, event };
  },
} as const;

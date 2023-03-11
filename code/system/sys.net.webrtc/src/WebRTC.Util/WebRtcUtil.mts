import { t } from './common';
import { connections } from './util.connections.mjs';
import { filter } from './util.filter.mjs';
import { identity } from './util.identity.mjs';
import { isType } from './util.isType.mjs';
import { waitFor } from './util.waitFor.mjs';

export const WebRTCUtil = {
  ...identity,

  waitFor,
  filter,
  connections,
  isType,

  toDataPayload(conn: t.PeerDataConnection, event: t.Event<any>): t.PeerDataPayload {
    const peer = conn.peer.local;
    const connection = conn.id;
    return { source: { peer, connection }, event };
  },
};

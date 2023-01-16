import { t, rx } from '../common';

const NS = {
  base: 'sys.net',
  peer: {
    base: 'sys.net/peer',
    data: 'sys.net/peer/data',
    connection: 'sys.net/peer/conn',
    local: 'sys.net/peer/local',
  },
  group: {
    base: 'sys.net/group',
  },
  fs: {
    base: 'sys.net/fs',
  },
};

/**
 * Flag filters for event namespaces.
 */
const is = {
  base: (e: t.Event) => is.peer.base(e) || is.group.base(e) || is.fs.base(e),
  peer: {
    base: isMatchHandler(NS.peer.base),
    data: isMatchHandler(NS.peer.data),
    connection: isMatchHandler(NS.peer.connection),
    local: isMatchHandler(NS.peer.local),
  },
  group: {
    base: isMatchHandler(NS.group.base),
  },
  fs: {
    base: isMatchHandler(NS.fs.base),
  },
};

/**
 * Event namespace index and helpers.
 */
export const EventNamespace = { ...NS, is };

/**
 * [Helpers]
 */
function isMatch(e: t.Event, ...prefixes: string[]) {
  return rx.isEvent(e) && prefixes.some((prefix) => e.type.startsWith(prefix));
}

function isMatchHandler(...prefixes: string[]) {
  return (e: t.Event) => isMatch(e, ...prefixes);
}

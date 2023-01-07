import * as t from './types.mjs';

type C = t.PeerConnectionStatus;

/**
 * Common filtering methods.
 */
export const FilterUtil = {
  connectionsAs<T extends C>(connections: C[], kind: C['kind'] | C['kind'][]) {
    const kinds = Array.isArray(kind) ? kind : [kind];
    return connections.filter((item) => kinds.includes(item.kind)).map((item) => item as T);
  },
};

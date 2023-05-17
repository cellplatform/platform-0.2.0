import type { t } from '../common.t';

export type NetworkDocShared = {
  count: number;
  network: t.NetworkState;
  tmp: t.JsonMap;
};

export const typeDef = `
export type NetworkDocShared = {
  count: number;
  network: t.NetworkState;
  tmp: t.JsonMap;
};
`.substring(1);

/**
 * Initial CRDT Document state.
 * Generated via: Crdt.Doc.Schema.toByteArray(...)  ← (check into source-control).
 */
export const bytes = new Uint8Array([
  133, 111, 74, 131, 177, 238, 240, 200, 1, 95, 0, 16, 102, 185, 43, 71, 75, 114, 76, 61, 183, 25,
  252, 137, 91, 235, 39, 48, 1, 1, 0, 0, 0, 8, 1, 6, 2, 6, 21, 31, 52, 1, 66, 4, 86, 4, 87, 1, 112,
  2, 0, 2, 2, 0, 0, 1, 0, 2, 2, 2, 0, 1, 123, 5, 99, 111, 117, 110, 116, 7, 110, 101, 116, 119, 111,
  114, 107, 5, 112, 101, 101, 114, 115, 5, 112, 114, 111, 112, 115, 3, 116, 109, 112, 5, 127, 1, 4,
  0, 127, 20, 4, 0, 0, 5, 0,
]);

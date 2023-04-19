import type { t } from '../common.t';

export type DocShared = {
  count: number;
  network: t.NetworkState;
  tmp: t.JsonMap;
};

export const typeDef = `
export type DocShared = {
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
  133, 111, 74, 131, 187, 52, 55, 0, 1, 89, 0, 16, 229, 131, 112, 53, 181, 182, 78, 82, 140, 25,
  195, 196, 136, 33, 23, 209, 1, 1, 0, 0, 0, 8, 1, 6, 2, 6, 21, 25, 52, 1, 66, 4, 86, 4, 87, 1, 112,
  2, 0, 2, 127, 0, 0, 1, 0, 2, 127, 2, 0, 1, 124, 5, 99, 111, 117, 110, 116, 7, 110, 101, 116, 119,
  111, 114, 107, 5, 112, 101, 101, 114, 115, 3, 116, 109, 112, 4, 127, 1, 3, 0, 127, 20, 3, 0, 0, 4,
  0,
]);

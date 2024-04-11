import type { t } from '../common.t';

export type NetworkDocShared = {
  network: t.NetworkState;
  tmp: t.JsonMap;
};

export const typeDef = `
export type NetworkDocShared = {
  network: t.NetworkState;
  tmp: t.JsonMap;
};
`.substring(1);

/**
 * Initial CRDT Document state.
 * Generated via: Crdt.Doc.Schema.toByteArray(...)  ← (check into source-control).
 */
export const bytes = new Uint8Array([
  133, 111, 74, 131, 131, 98, 31, 54, 1, 82, 0, 16, 126, 225, 201, 7, 58, 5, 68, 18, 158, 92, 100,
  103, 143, 150, 251, 110, 1, 1, 0, 0, 0, 7, 1, 6, 2, 6, 21, 25, 52, 1, 66, 2, 86, 2, 112, 2, 0, 1,
  2, 0, 0, 1, 0, 1, 2, 1, 0, 1, 124, 7, 110, 101, 116, 119, 111, 114, 107, 5, 112, 101, 101, 114,
  115, 5, 112, 114, 111, 112, 115, 3, 116, 109, 112, 4, 4, 0, 4, 0, 4, 0,
]);

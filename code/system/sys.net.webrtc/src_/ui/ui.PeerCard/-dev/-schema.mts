import type { t } from '../../../common.t';

export type DocShared = {
  network: t.NetworkState;
  count: number;
  json?: t.JsonMap;
};

/**
 * Initial CRDT Document state.
 * Generated via: Crdt.Doc.Schema.toByteArray(...)  ← (check into source-control).
 */
export const initialSharedDoc = new Uint8Array([
  133, 111, 74, 131, 152, 191, 106, 255, 1, 81, 0, 16, 174, 77, 115, 7, 210, 252, 74, 42, 149, 220,
  127, 212, 110, 10, 123, 8, 1, 1, 0, 0, 0, 8, 1, 4, 2, 4, 21, 21, 52, 1, 66, 4, 86, 4, 87, 1, 112,
  2, 0, 2, 127, 0, 0, 2, 127, 2, 125, 5, 99, 111, 117, 110, 116, 7, 110, 101, 116, 119, 111, 114,
  107, 5, 112, 101, 101, 114, 115, 3, 127, 1, 2, 0, 127, 20, 2, 0, 0, 3, 0,
]);

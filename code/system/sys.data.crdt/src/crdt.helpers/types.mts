import type { t } from '../common.t';

/**
 * Convert a CRDT (Automerge) document to a plain object.
 */
export type CrdtAsObject = <D extends {}>(doc: D | t.CrdtDocRef<D>) => D;

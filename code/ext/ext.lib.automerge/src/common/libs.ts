/**
 * @external
 */
export { next as A } from '@automerge/automerge';
import { clone, equals, uniqBy } from 'ramda';
export const R = { clone, equals, uniqBy } as const;

/**
 * @system
 */
export { IndexedDb } from 'sys.data.indexeddb';
export { PatchState } from 'sys.data.json';
export { Delete, Hash, Id, Time, Value, cuid, rx, slug } from 'sys.util';

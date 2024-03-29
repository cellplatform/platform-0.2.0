/**
 * @external
 */
export { next as A } from '@automerge/automerge';
import { clone, equals, uniq, uniqBy } from 'ramda';
export const R = { clone, equals, uniq, uniqBy } as const;

/**
 * @system
 */
export { IndexedDb } from 'sys.data.indexeddb';
export { PatchState, Path } from 'sys.data.json';
export { Delete, Hash, Id, Time, Value, cuid, rx, slug } from 'sys.util';

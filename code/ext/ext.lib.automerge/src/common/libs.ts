/**
 * @external
 */
export { next as A } from '@automerge/automerge';
import { clone, equals } from 'ramda';
export const R = { clone, equals } as const;

/**
 * @system
 */
export { IndexedDb } from 'sys.data.indexeddb';
export { PatchState } from 'sys.data.json';
export { Hash, Id, Time, cuid, rx, slug } from 'sys.util';

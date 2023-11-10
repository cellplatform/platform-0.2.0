/**
 * @external
 */
import { clone, equals } from 'ramda';
export const R = { clone, equals } as const;
export { next as A } from '@automerge/automerge';

/**
 * @system
 */
export { IndexedDb } from 'sys.data.indexeddb';
export { PatchState } from 'sys.data.json';
export { Id, Time, cuid, rx, slug } from 'sys.util';

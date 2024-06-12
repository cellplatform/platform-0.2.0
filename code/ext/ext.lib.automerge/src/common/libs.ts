/**
 * @external
 */
export { next as A } from '@automerge/automerge';
export { PatchState } from 'ext.lib.immer';

import { clone, equals, uniq, uniqBy } from 'ramda';
export const R = { clone, equals, uniq, uniqBy } as const;

/**
 * @system
 */
export { IndexedDb } from 'sys.data.indexeddb';
export { Delete, Hash, Id, ObjectPath, Time, Value, cuid, rx, slug } from 'sys.util';

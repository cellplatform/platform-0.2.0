/**
 * @external
 */
export { PatchState } from 'ext.lib.immer';
export { next as A } from '@automerge/automerge';

import { clone, equals, uniq, uniqBy } from 'ramda';
export const R = { clone, equals, uniq, uniqBy } as const;

/**
 * @system
 */
export { Cmd } from 'sys.cmd';
export { IndexedDb } from 'sys.data.indexeddb';
export {
  Args,
  cuid,
  Delete,
  Hash,
  Id,
  Immutable,
  Json,
  ObjectPath,
  rx,
  slug,
  Time,
  Value,
} from 'sys.util';

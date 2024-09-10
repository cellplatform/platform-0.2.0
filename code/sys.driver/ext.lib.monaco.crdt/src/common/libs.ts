/**
 * @external
 */
import { clone, equals, uniq } from 'ramda';
export const R = { clone, equals, uniq } as const;

/**
 * @ext.lib
 */
export { A, Crdt, Doc, Store, WebStore } from 'ext.lib.automerge';
export { Monaco } from 'ext.lib.monaco';

/**
 * @system
 */
export { Cmd } from 'sys.cmd';
export { Immutable, Json, ObjectPath, Path, rx, slug, Time, Value } from 'sys.util';

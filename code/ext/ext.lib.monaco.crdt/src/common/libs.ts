/**
 * @external
 */
import { equals } from 'ramda';
export const R = { equals } as const;

/**
 * @ext.lib
 */
export { A, Doc, Store, WebStore } from 'ext.lib.automerge';
export { Monaco } from 'ext.lib.monaco';

/**
 * @system
 */
export { Time, rx, Path } from 'sys.util';

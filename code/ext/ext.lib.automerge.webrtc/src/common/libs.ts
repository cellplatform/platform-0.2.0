/**
 * @external
 */
import { equals } from 'ramda';
export const R = { equals } as const;
export { next as A } from '@automerge/automerge';

/**
 * @ext
 */
export { Doc, Store, WebStore } from 'ext.lib.automerge';

/**
 * @system
 */
export { Filesize, Hash, Time, cuid, rx } from 'sys.util';

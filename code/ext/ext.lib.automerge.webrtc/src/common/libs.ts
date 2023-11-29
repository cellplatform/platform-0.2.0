/**
 * @external
 */
import { equals } from 'ramda';
export const R = { equals } as const;
export { next as A } from '@automerge/automerge';

/**
 * @ext
 */
export { Store, WebStore, Doc } from 'ext.lib.automerge';

/**
 * @system
 */
export { Filesize, Time, cuid, rx } from 'sys.util';

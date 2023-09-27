/**
 * @external
 */
import { equals } from 'ramda';
export const R = { equals } as const;
export { next as A } from '@automerge/automerge';

export { WebStore } from 'ext.lib.automerge';

/**
 * @system
 */
export { cuid, rx } from 'sys.util';

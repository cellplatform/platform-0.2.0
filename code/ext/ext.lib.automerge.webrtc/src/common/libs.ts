import { equals } from 'ramda';
export const R = { equals } as const;
export { next as A } from '@automerge/automerge';

/**
 * @ext
 */
export { WebStore } from 'ext.lib.automerge';

/**
 * @system
 */
export { Time, cuid, rx } from 'sys.util';

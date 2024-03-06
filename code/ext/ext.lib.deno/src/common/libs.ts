/**
 * @external
 */
import { descend, equals, prop, reverse, sortBy, sortWith, uniqBy } from 'ramda';
export const R = { descend, equals, prop, reverse, sortBy, sortWith, uniqBy } as const;

export { Doc } from 'ext.lib.automerge';

/**
 * @system
 */
export { Delete, Hash, Path, rx, slug } from 'sys.util';

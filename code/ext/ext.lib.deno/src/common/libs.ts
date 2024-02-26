/**
 * @external
 */
import { descend, equals, prop, sortBy, sortWith, uniqBy } from 'ramda';
export const R = { descend, equals, prop, sortBy, sortWith, uniqBy } as const;

/**
 * @system
 */
export { Delete, Hash, Path, rx, slug } from 'sys.util';

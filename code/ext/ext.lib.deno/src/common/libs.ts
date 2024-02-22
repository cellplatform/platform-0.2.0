/**
 * @external
 */
import { descend, equals, prop, sortBy, sortWith } from 'ramda';
export const R = { descend, equals, prop, sortBy, sortWith } as const;

/**
 * @system
 */
export { Delete, Path, rx, slug } from 'sys.util';

/**
 * @external
 */
import { groupBy, prop, sortBy, uniq } from 'ramda';
export const R = { groupBy, prop, sortBy, uniq } as const;

/**
 * @system
 */
export { rx, Time, slug } from 'sys.util';
export { Path, Filesize, TestFilesystem } from 'sys.fs';

/**
 * @external
 */
import { equals, clone, clamp, uniq } from 'ramda';
export const R = { equals, clone, clamp, uniq } as const;

/**
 * @system
 */
export { rx, slug, Time, Delete, Hash, maybeWait, Is } from 'sys.util';

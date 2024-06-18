/**
 * @external
 */
import { equals, uniq } from 'ramda';
export const R = { equals, uniq } as const;

/**
 * @system
 */
export { Delete, Immutable, ObjectPath, Time, Value, rx, slug } from 'sys.util';

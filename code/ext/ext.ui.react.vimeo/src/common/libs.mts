/**
 * @external
 */
import { clamp, equals } from 'ramda';
export const R = { equals, clamp } as const;

/**
 * @system
 */
export { Delete, Time, rx, slug } from 'sys.util';

/**
 * @external
 */
import { equals } from 'ramda';
export const R = { equals } as const;

/**
 * @system
 */
export { Patch, PatchState } from 'sys.data.json';
export { Is, Time, Value, asArray, rx, slug } from 'sys.util';

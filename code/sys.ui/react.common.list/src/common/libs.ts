/**
 * @external
 */
import { equals } from 'ramda';
export const R = { equals } as const;

/**
 * @system
 */
export { Patch, PatchState } from 'ext.lib.immer';
export { Is, Time, Value, asArray, rx, slug } from 'sys.util';

/**
 * @external
 */
import { equals } from 'ramda';
export const R = { equals } as const;

/**
 * @system
 */
export { PatchState } from 'sys.data.json';
export { Hash, Id, Is, Path, Time, Value, cuid, rx, slug } from 'sys.util';

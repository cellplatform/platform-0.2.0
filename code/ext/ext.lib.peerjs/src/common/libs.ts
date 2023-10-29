/**
 * @external
 */
import { equals } from 'ramda';
export const R = { equals } as const;

/**
 * @system
 */
export { PatchState } from 'sys.data.json';
export { Hash, Id, Path, Time, cuid, rx, slug, Value } from 'sys.util';

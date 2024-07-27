/**
 * @external
 */
import { equals } from 'ramda';
export const R = { equals } as const;

/**
 * @system
 */
export { PatchState } from 'ext.lib.immer';
export { cuid, Hash, Id, Immutable, Is, Json, Path, rx, slug, Time, Value } from 'sys.util';

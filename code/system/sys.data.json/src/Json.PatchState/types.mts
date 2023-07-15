import { type t } from './common';

/**
 * Simple safe/immutable state wrapper for the data object.
 */
export type PatchState<T> = t.Immutable<T> & {
  readonly instance: { id: string };
};

import type { t } from './common';

type Id = string;

/**
 * Simple safe/immutable state wrapper for the data object.
 */
export type PatchState<T> = t.Immutable<T> & { readonly instance: Id };

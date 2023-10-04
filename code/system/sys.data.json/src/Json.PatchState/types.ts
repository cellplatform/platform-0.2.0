import type { t } from './common';

type O = Record<string, unknown>;
type Id = string;

/**
 * Simple safe/immutable state wrapper for the data object.
 */
export type PatchState<T extends O> = t.Immutable<T> & {
  readonly instance: Id;
  events(dispose?: t.Observable<any>): t.PatchStateEvents<T>;
};

/**
 * Event API
 */
export type PatchStateEvents<T extends O> = t.Lifecycle & { $: t.Observable<t.PatchChange<T>> };

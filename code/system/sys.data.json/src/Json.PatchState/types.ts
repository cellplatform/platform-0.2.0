import type { t } from './common';

type O = Record<string, unknown>;

/**
 * Simple safe/immutable state wrapper for the data object.
 */
export type PatchState<T extends O, E = PatchStateEvents<T>> = t.ImmutableRef<T, E> & {
  type?: string;
};

/**
 * Event API
 *    Basic observable/disposable event provider firing
 *    the core stream of JSON-Patches emitted when the
 *    change(fn) method updates the current immutable state.
 */
export type PatchStateEvents<T extends O> = t.Lifecycle & {
  readonly $: t.Observable<t.PatchChange<T>>;
};

/**
 * Injection factory for producing observable event objects
 * with a discreet lifetime.
 */
export type PatchStateEventFactory<T extends O, E> = (
  $: t.Observable<t.PatchChange<T>>,
  dispose$?: t.UntilObservable,
) => E;

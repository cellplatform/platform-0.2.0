import type { t } from '../common';

/**
 * Immutable object with mutator change function.
 */
export type ImmutableNext<T> = (draft: T) => void;
export type Immutable<T> = {
  readonly current: T;
  change(fn: ImmutableNext<T>): void;
};

/**
 * A reference handle to an Immutable<T> with
 * an observable event factory.
 */
export type ImmutableRef<T, E> = Immutable<T> & {
  events(dispose$?: t.UntilObservable): E;
  readonly instance: string;
  readonly typename?: string; // Optional typename (for reflection).
};

/**
 * Generic immutable events observer.
 * See: sys.util → Immutable.events()
 */
export type ImmutableChange<T> = { readonly before: T; readonly after: T };
export type ImmutableEvents<T, C extends ImmutableChange<T> = ImmutableChange<T>> = t.Lifecycle & {
  readonly changed$: t.Observable<C>;
};

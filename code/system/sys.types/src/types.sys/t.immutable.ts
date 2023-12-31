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
  readonly instance: string;
  readonly type?: string; // Optional typename.
  events(dispose$?: t.UntilObservable): E;
};

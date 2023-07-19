/**
 * Immutable object with mutator function.
 */
export type Immutable<T> = {
  readonly current: T;
  change(fn: ImmutableNext<T>): void;
};

export type ImmutableNext<T> = (draft: T) => void;

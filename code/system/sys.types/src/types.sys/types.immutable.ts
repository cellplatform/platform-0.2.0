import type { t } from '../common';

/**
 * Immutable object with mutator function.
 */
export type ImmutableNext<T> = (draft: T) => void;
export type Immutable<T> = {
  readonly current: T;
  change(fn: ImmutableNext<T>): void;
};


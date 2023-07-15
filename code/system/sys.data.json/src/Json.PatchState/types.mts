export type Immutable<T> = {
  readonly current: T;
  change(fn: ImmutableNext<T>): void;
};
export type ImmutableNext<T> = (draft: T) => void;

/**
 * Simple safe/immutable state wrapper for the data object.
 */
export type PatchState<T> = Immutable<T> & {
  readonly instance: { id: string };
};

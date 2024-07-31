import type { t } from '../common';

type O = Record<string, unknown>;

/**
 * Immutable object with mutator change function.
 */
export type Immutable<D = O, P = unknown> = {
  readonly current: D;
  change(fn: ImmutableMutator<D>, options?: ImmutableChangeOptions<P>): void;
};

/**
 * Immutable change/mutator functions.
 */
export type ImmutableMutator<D = O> = (draft: D) => void;

export type ImmutablePatchCallback<P> = (patches: P[]) => void;
export type ImmutableChangeOptions<P> =
  | ImmutablePatchCallback<P>
  | { patches?: ImmutablePatchCallback<P> };

/**
 * A reference handle to an Immutable<T> with
 * an observable event factory.
 */
export type ImmutableRef<D = O, E = unknown, P = unknown> = Immutable<D, P> & {
  readonly instance: string; // Unique ID of the reference handle.
  events(dispose$?: t.UntilObservable): E;
};

/**
 * Generic immutable events observer.
 *
 * See example reference implementation in:
 *   sys.util → Immutable.events(💥):💦
 *
 */
export type ImmutableEvents<
  D,
  P,
  C extends ImmutableChange<D, P> = ImmutableChange<D, P>,
> = t.Lifecycle & { readonly changed$: t.Observable<C> };

/**
 * Represents a before/after patched change to the immutable state.
 */
export type ImmutableChange<D, P> = {
  readonly before: D;
  readonly after: D;
  readonly patches: P[];
};

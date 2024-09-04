import type { t } from '../common';

type O = Record<string, unknown>;

/**
 * Immutable object with mutator change function.
 */
export type Immutable<D = O, P = unknown> = {
  readonly current: D;
  change(fn: ImmutableMutator<D>, options?: ImmutableChangeOptionsInput<P>): void;
};

/**
 * Immutable change/mutator functions.
 */
export type ImmutableMutator<D = O> = (draft: D) => void;

export type ImmutableChangeOptionsInput<P> = ImmutablePatchCallback<P> | ImmutableChangeOptions<P>;
export type ImmutablePatchCallback<P> = (patches: P[]) => void;
export type ImmutableChangeOptions<P> = {
  patches?: ImmutablePatchCallback<P>;
  tx?: t.IdString; // NB: used for granular identification of change events.
};

/**
 * A reference handle to an Immutable<T> with
 * an observable event factory.
 */
export type ImmutableRef<D = O, P = unknown, E = unknown> = Immutable<D, P> & {
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
  readonly tx?: t.IdString;
};

/**
 * A mapping used to create single composite data object
 * out of paths pointing to sub-parts of other immutable references.
 */
export type ImmutableMapProp<T extends O, P> = [t.ImmutableRef, MapToPath];
export type ImmutableMap<T extends O, P> = { [K in keyof T]: t.ImmutableMapProp<T, P> };
type MapPropName = string;
type MapToPath = t.ObjectPath | MapPropName;

/**
 * A JSON change/patch operation (RFC-6902) extended
 * with the address (URI) of the underlying mapped
 * document the patch pertains to.
 */
export type ImmutableMapPatch<P> = P & { mapping: ImmutableMapPatchInfo };
export type ImmutableMapPatchInfo = { key: string; doc: string };

/**
 * Takes a patch after a change operation and formats it
 * with identifying meta-data.
 */
export type ImmutableMapFormatPatch<P> = (e: t.ImmutableMapFormatPatchArgs<P>) => P;
export type ImmutableMapFormatPatchArgs<P> = {
  patch: P;
  key: string;
  doc: t.ImmutableRef;
};

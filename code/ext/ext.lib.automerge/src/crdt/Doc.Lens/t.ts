import type { t } from '../common';

type O = Record<string, unknown>;
type NonUndefined<T> = T extends undefined ? never : T;

export type InitializeLens<T> = (doc: T) => void;

/**
 * Lens for operating on a sub-tree within a CRDT.
 */
export type Lens<L extends O = O> = t.ImmutableRef<L, LensEvents<L>> & {
  lens<T extends O>(path: t.ObjectPath, init?: InitializeLens<L>): Lens<NonUndefined<T>>; // NB: type hack to ensure T is not undefined.
  toObject(): L;
} & t.Lifecycle;

/**
 * Events API
 */
export type LensEvents<L extends O> = t.Lifecycle & {
  readonly $: t.Observable<LensEvent<L>>;
  readonly changed$: t.Observable<LensChanged<L>>;
  readonly deleted$: t.Observable<LensDeleted<L>>;
};

/**
 * Events
 */
export type LensEvent<L extends O = O> = LensChangedEvent<L> | LensDeletedEvent<L>;

/**
 * - Changed
 */
export type LensChangedEvent<L extends O = O> = {
  type: 'crdt:lens/Changed';
  payload: LensChanged<L>;
};
export type LensChanged<L extends O = O> = t.DocChanged<L>;

/**
 * - Deleted
 */
export type LensDeletedEvent<L extends O = O> = {
  type: 'crdt:lens/Deleted';
  payload: LensDeleted<L>;
};
export type LensDeleted<L extends O = O> = { uri: t.DocUri; before: L; after: undefined };

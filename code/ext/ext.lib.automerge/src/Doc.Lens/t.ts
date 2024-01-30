import type { t } from '../common';

type NonUndefined<T> = T extends undefined ? never : T;

export type InitializeLens<T> = (doc: T) => void;

/**
 * Lens for operating on a sub-tree within a CRDT.
 */
export type Lens<L> = t.ImmutableRef<L, LensEvents<L>> & {
  lens<T>(path: t.JsonPath, init?: InitializeLens<L>): Lens<NonUndefined<T>>; // NB: type hack to ensure T is not undefined.
  toObject(): L;
} & t.Lifecycle;

/**
 * Events API
 */
export type LensEvents<L> = t.Lifecycle & {
  readonly $: t.Observable<LensEvent<L>>;
  readonly changed$: t.Observable<LensChanged<L>>;
  readonly deleted$: t.Observable<LensDeleted<L>>;
};

/**
 * Events
 */
export type LensEvent<L> = LensChangedEvent<L> | LensDeletedEvent<L>;

/**
 * - Changed
 */
export type LensChangedEvent<L> = {
  type: 'crdt:lens:changed';
  payload: LensChanged<L>;
};
export type LensChanged<L> = { before: L; after: L; patches: t.Patch[] };

/**
 * - Deleted
 */
export type LensDeletedEvent<L> = {
  type: 'crdt:lens:deleted';
  payload: LensDeleted<L>;
};
export type LensDeleted<L> = { before: L; after: undefined };

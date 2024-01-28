import type { t } from '../common';

export type LensInitial<R extends object> = (doc: R) => void;

/**
 * Lens for operating on a sub-tree within a CRDT.
 */
export type Lens<L extends object> = t.ImmutableRef<L, LensEvents<L>> & {
  lens<T extends object>(path: t.JsonPath, init?: LensInitial<L>): Lens<T>;
  toObject(): L;
} & t.Lifecycle;

/**
 * Events API
 */
export type LensEvents<L extends object> = t.Lifecycle & {
  readonly $: t.Observable<LensEvent<L>>;
  readonly changed$: t.Observable<LensChanged<L>>;
  readonly deleted$: t.Observable<LensDeleted<L>>;
};

/**
 * Events
 */
export type LensEvent<L extends object> = LensChangedEvent<L> | LensDeletedEvent<L>;

/**
 * - Changed
 */
export type LensChangedEvent<L extends object> = {
  type: 'crdt:lens:changed';
  payload: LensChanged<L>;
};
export type LensChanged<L extends object> = { before: L; after: L; patches: t.Patch[] };

/**
 * - Deleted
 */
export type LensDeletedEvent<L extends object> = {
  type: 'crdt:lens:deleted';
  payload: LensDeleted<L>;
};
export type LensDeleted<L extends object> = { before: L; after: undefined };

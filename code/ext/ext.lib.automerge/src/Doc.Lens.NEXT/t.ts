import type { t } from '../common';

export type LensInitial2<R extends {}> = (doc: R) => void;

/**
 * Lens for operating on a sub-tree within a CRDT.
 */
export type Lens2<L extends {}> = t.ImmutableRef<L, LensEvents2<L>> & {
  lens<T extends {}>(path: t.JsonPath, init?: LensInitial2<L>): Lens2<T>;
  toObject(): L;
} & t.Lifecycle;

/**
 * Events API
 */
export type LensEvents2<L extends {}> = t.Lifecycle & {
  readonly $: t.Observable<LensEvent2<L>>;
  readonly changed$: t.Observable<LensChanged2<L>>;
  readonly deleted$: t.Observable<LensDeleted2<L>>;
};

/**
 * Events
 */
export type LensEvent2<L extends {}> = LensChangedEvent2<L> | LensDeletedEvent2<L>;

/**
 * - Changed
 */
export type LensChangedEvent2<L extends {}> = {
  type: 'crdt:lens:changed';
  payload: LensChanged2<L>;
};
export type LensChanged2<L extends {}> = { before: L; after: L };

/**
 * - Deleted
 */
export type LensDeletedEvent2<L extends {}> = {
  type: 'crdt:lens:deleted';
  payload: LensDeleted2<L>;
};
export type LensDeleted2<L extends {}> = { before: L; after: undefined };

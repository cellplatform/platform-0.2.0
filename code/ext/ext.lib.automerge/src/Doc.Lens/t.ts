import type { t } from '../common';

/**
 * Retrieves a child descentent from within a {document} object.
 */
export type LensGetDescendent<R extends {}, L extends {}> = (doc: R) => L;

/**
 * Lens for operating on a sub-tree within a CRDT.
 */
export type Lens<L extends {}> = t.ImmutableRef<L, LensEvents<L>> & {
  lens<T extends {}>(get: LensGetDescendent<L, T>): Lens<T>;
  toObject(): L;
} & t.Lifecycle;

/**
 * Events API
 */
export type LensEvents<L extends {}> = t.Lifecycle & {
  readonly $: t.Observable<LensEvent<L>>;
  readonly changed$: t.Observable<LensChanged<L>>;
  readonly deleted$: t.Observable<LensDeleted<L>>;
};

/**
 * Events
 */
export type LensEvent<L extends {}> = LensChangedEvent<L> | LensDeletedEvent<L>;

/**
 * - Changed
 */
export type LensChangedEvent<L extends {}> = {
  type: 'crdt:lens:changed';
  payload: LensChanged<L>;
};
export type LensChanged<L extends {}> = { before: L; after: L };

/**
 * - Deleted
 */
export type LensDeletedEvent<L extends {}> = {
  type: 'crdt:lens:deleted';
  payload: LensDeleted<L>;
};
export type LensDeleted<L extends {}> = { before: L; after: undefined };

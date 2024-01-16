import type { t } from '../common';

/**
 * Retrieves a child descentent from within a {document} object.
 */
export type LensGetDescendent<R extends {}, L extends {}> = (doc: R) => L;

/**
 * Lens for operating on a sub-tree within a CRDT.
 */
export type Lens<R extends {}, L extends {}> = t.ImmutableRef<L, LensEvents<R, L>> & {
  readonly root: t.DocRef<R>;
  lens<T extends {}>(get: LensGetDescendent<L, T>): Lens<R, T>;
  toObject(): L;
} & t.Lifecycle;

/**
 * Events API
 */
export type LensEvents<R extends {}, L extends {}> = t.Lifecycle & {
  readonly $: t.Observable<LensEvent<R, L>>;
  readonly changed$: t.Observable<LensChanged<R, L>>;
  readonly deleted$: t.Observable<LensDeleted<R, L>>;
};

/**
 * Events
 */
export type LensEvent<R extends {}, L extends {}> = LensChangedEvent<R, L> | LensDeletedEvent<R, L>;

/**
 * - Changed
 */
export type LensChangedEvent<R extends {}, L extends {}> = {
  type: 'crdt:lens:changed';
  payload: LensChanged<R, L>;
};
export type LensChanged<R extends {}, L extends {}> = t.DocChanged<R> & { lens: L };

/**
 * - Deleted
 */
export type LensDeletedEvent<R extends {}, L extends {}> = {
  type: 'crdt:lens:deleted';
  payload: LensDeleted<R, L>;
};
export type LensDeleted<R extends {}, L extends {}> = t.DocDeleted<R> & { lens: L };

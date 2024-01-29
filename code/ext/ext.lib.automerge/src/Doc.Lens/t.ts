import type { t } from '../common';

type O = Record<string, unknown>;
export type InitializeLens<T extends O> = (doc: T) => void;

/**
 * Lens for operating on a sub-tree within a CRDT.
 */
export type Lens<L extends O> = t.ImmutableRef<L, LensEvents<L>> & {
  lens<T extends O>(path: t.JsonPath, init?: InitializeLens<L>): Lens<T>;
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
export type LensEvent<L extends O> = LensChangedEvent<L> | LensDeletedEvent<L>;

/**
 * - Changed
 */
export type LensChangedEvent<L extends O> = {
  type: 'crdt:lens:changed';
  payload: LensChanged<L>;
};
export type LensChanged<L extends O> = { before: L; after: L; patches: t.Patch[] };

/**
 * - Deleted
 */
export type LensDeletedEvent<L extends O> = {
  type: 'crdt:lens:deleted';
  payload: LensDeleted<L>;
};
export type LensDeleted<L extends O> = { before: L; after: undefined };

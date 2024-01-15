import type { t } from '../common';

/**
 * Retrieves a child descentent from within a {document} object.
 */
export type LensGetDescendent<R extends {}, L extends {}> = (doc: R) => L;

/**
 * Lens for operating on a sub-tree within a CRDT.
 */
export type Lens<R extends {}, L extends {}> = t.Lifecycle & {
  readonly root: t.DocRef<R>;
  readonly $: t.Observable<LensChange<R, L>>;
  readonly current: L;
  change(fn: t.ImmutableNext<L>): t.Lens<R, L>;
  lens<T extends {}>(get: LensGetDescendent<L, T>): Lens<R, T>;
  toObject(): L;
};

/**
 * Events
 */
export type LensChange<R extends {}, L extends {}> = t.DocChanged<R> & { lens: L };

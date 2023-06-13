import type { t } from '../common.t';

/**
 * Retrieves a child descentent from within a {document} object.
 */
export type CrdtLensDescendent<D extends {}, C extends {}> = (doc: D) => C;

/**
 * Lens for operating on a sub-tree within a CRDT.
 */
export type CrdtLens<D extends {}, L extends {}> = t.Lifecycle & {
  readonly kind: 'Crdt:Lens';
  readonly root: t.CrdtDocRef<D>;
  readonly $: t.Observable<CrdtLensChange<D, L>>;
  readonly current: L;
  change(fn: t.CrdtMutator<L>): t.CrdtLens<D, L>;
  change(message: string, fn: t.CrdtMutator<L>): t.CrdtLens<D, L>;
  lens<T extends {}>(get: CrdtLensDescendent<L, T>): CrdtLens<D, T>;
  toObject(): L;
};

export type CrdtLensChange<D extends {}, C extends {}> = t.CrdtDocChange<D> & { lens: C };

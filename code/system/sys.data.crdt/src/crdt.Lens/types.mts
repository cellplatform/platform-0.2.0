import type { t } from '../common.t';

/**
 * Retrieves a child descentent from within a {document} object.
 */
export type CrdtLensDescendent<D extends {}, C extends {}> = (doc: D) => C;

/**
 * Lens for operating on a sub-tree within a CRDT.
 */
export type CrdtLens<D extends {}, C extends {}> = t.Lifecycle & {
  readonly kind: 'Crdt:Lens';
  readonly root: t.CrdtDocRef<D>;
  readonly $: t.Observable<CrdtLensChange<D, C>>;
  readonly current: C;
  change(fn: t.CrdtMutator<C>): t.CrdtLens<D, C>;
  change(message: string, fn: t.CrdtMutator<C>): t.CrdtLens<D, C>;
};

export type CrdtLensChange<D extends {}, C extends {}> = t.CrdtDocChange<D> & { lens: C };

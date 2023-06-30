import type { t } from '../common.t';

/**
 * Retrieves a child descentent from within a {document} object.
 */
export type CrdtLensDescendent<R extends {}, L extends {}> = (doc: R) => L;

/**
 * Lens for operating on a sub-tree within a CRDT.
 */
export type CrdtLens<R extends {}, L extends {}> = t.Lifecycle & {
  readonly kind: 'Crdt:Lens';
  readonly root: t.CrdtDocRef<R>;
  readonly $: t.Observable<CrdtLensChange<R, L>>;
  readonly current: L;
  change(fn: t.CrdtMutator<L>): t.CrdtLens<R, L>;
  change(message: string, fn: t.CrdtMutator<L>): t.CrdtLens<R, L>;
  lens<T extends {}>(get: CrdtLensDescendent<L, T>): CrdtLens<R, T>;
  toObject(): L;
};

export type CrdtLensChange<R extends {}, L extends {}> = t.CrdtDocChange<R> & { lens: L };

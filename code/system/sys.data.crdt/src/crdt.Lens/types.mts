import { type t } from '../common.t';

/**
 * Map containing a namespaces of child objects
 * that are managed by a lenes.
 */
export type CrdtNamespaceMap<K extends string = string> = Record<K, {}>;
export type CrdtNamespaceMapLens<R extends {}> = CrdtLensDescendent<R, CrdtNamespaceMap>;

export type CrdtNamespaceManager<R extends {}, N extends string = string> = t.Lifecycle & {
  readonly kind: 'Crdt:Namespace';
  readonly container: t.CrdtNamespaceMap<N>;
  lens<L extends {}>(namespace: N, initial: L): CrdtLens<R, L>;
};

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

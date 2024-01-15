import type { t } from '../common';


/**
 * Lens Namespace.
 */
export type CrdtNsMap<N extends string = string> = Record<N, {}>;
export type CrdtNsMapGetLens<R extends {}> = t.CrdtLensGetDescendent<R, CrdtNsMap>;
export type CrdtNsChange<R extends {}, N extends string = string> = t.CrdtLensChange<
  R,
  CrdtNsMap<N>
>;

export type CrdtNs<R extends {}, L extends {}, N extends string = string> = {
  namespace: N;
  lens: t.CrdtLens<R, L>;
};

export type CrdtNsManager<R extends {}, N extends string = string> = t.Lifecycle & {
  readonly kind: 'crdt:namespace';
  readonly $: t.Observable<CrdtNsChange<R, N>>;
  readonly container: CrdtNsMap<N>;
  lens<L extends {}>(namespace: N, initial: L): t.CrdtLens<R, L>;
  list<L extends {}>(): CrdtNs<R, L, N>[];
};

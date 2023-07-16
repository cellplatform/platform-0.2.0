import type { t } from '../common';

/**
 * Lens Namespace.
 */
export type CrdtNsMap<N extends string = string> = Record<N, {}>;
export type CrdtNsMapGetLens<R extends {}> = t.CrdtLensGetDescendent<R, CrdtNsMap>;
export type CrdtNsChange<R extends {}, N extends string = string> = t.CrdtLensChange<
  R,
  t.CrdtNsMap<N>
>;

export type CrdtNsItem<R extends {}, L extends {}, N extends string = string> = {
  namespace: N;
  lens: t.CrdtLens<R, L>;
};

export type CrdtNsManager<R extends {}, N extends string = string> = t.Lifecycle & {
  readonly kind: 'Crdt:Namespace';
  readonly $: t.Observable<t.CrdtNsChange<R, N>>;
  readonly container: t.CrdtNsMap<N>;
  lens<L extends {}>(namespace: N, initial: L): t.CrdtLens<R, L>;
  list<L extends {}>(): CrdtNsItem<R, L, N>[];
};

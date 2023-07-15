import type { t } from '../common';

/**
 * Lens Namespace.
 */
export type CrdtNsMap<K extends string = string> = Record<K, {}>;
export type CrdtNsMapGetLens<R extends {}> = t.CrdtLensGetDescendent<R, CrdtNsMap>;
export type CrdtNsChange<R extends {}, N extends string = string> = t.CrdtLensChange<
  R,
  t.CrdtNsMap<N>
>;

export type CrdtNsManager<R extends {}, N extends string = string> = t.Lifecycle & {
  readonly kind: 'Crdt:Namespace';
  readonly $: t.Observable<t.CrdtNsChange<R, N>>;
  readonly container: t.CrdtNsMap<N>;
  lens<L extends {}>(namespace: N, initial: L): t.CrdtLens<R, L>;
};

import type { t } from '../common';

export type NamespaceMap<N extends string = string> = Record<N, {}>;
export type NamespaceMapGetLens<R extends {}> = t.LensGetDescendent<R, NamespaceMap>;
export type NamespaceChange<R extends {}, N extends string = string> = t.LensEvent<
  R,
  NamespaceMap<N>
>;

export type Namespace<R extends {}, L extends {}, N extends string = string> = {
  namespace: N;
  lens: t.Lens<R, L>;
};

export type NamespaceManager<R extends {}, N extends string = string> = t.Lifecycle & {
  readonly kind: 'crdt:namespace';
  readonly $: t.Observable<NamespaceChange<R, N>>;
  readonly container: NamespaceMap<N>;
  lens<L extends {}>(namespace: N, initial: L): t.Lens<R, L>;
  list<L extends {}>(): Namespace<R, L, N>[];
};

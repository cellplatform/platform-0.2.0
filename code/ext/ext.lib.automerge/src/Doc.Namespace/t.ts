import type { t } from '../common';

export type NamespaceMap<N extends string = string> = Record<N, {}>;
export type NamespaceMapGetLens<R extends {}> = t.LensGetDescendent<R, NamespaceMap>;

export type Namespace<L extends {}, N extends string = string> = {
  namespace: N;
  lens: t.Lens<L>;
};

export type NamespaceManager<N extends string = string> = t.Lifecycle & {
  readonly kind: 'crdt:namespace';
  readonly container: Readonly<NamespaceMap<N>>;
  lens<L extends {}>(namespace: N, initial: L, options?: { type?: string }): t.Lens<L>;
  list<L extends {}>(): Namespace<L, N>[];
  events(dispose$?: t.UntilObservable): t.LensEvents<t.NamespaceMap<N>>;
};

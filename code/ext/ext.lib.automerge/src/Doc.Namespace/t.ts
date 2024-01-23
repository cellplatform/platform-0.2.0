import type { t } from '../common';

export type NamespaceMap<N extends string = string> = Record<N, {}>;
export type NamespaceMapGetLens<R extends {}> = t.LensGetDescendent<R, NamespaceMap>;
export type Namespace<L extends {}, N extends string = string> = { namespace: N; lens: t.Lens<L> };

/**
 * Manager for working with [Lens] objects attached to a {map}
 * where the "keys" are the namespace "names".
 */
export type NamespaceManager<N extends string = string> = t.Lifecycle & {
  readonly kind: 'crdt:namespace';
  readonly container: Readonly<NamespaceMap<N>>;
  list<L extends {}>(): Namespace<L, N>[];
  lens<L extends {}>(namespace: N, initial: L, options?: { typename?: string }): t.Lens<L>;
  events(dispose$?: t.UntilObservable): t.LensEvents<t.NamespaceMap<N>>;
};

import type { t } from '../common';

export type NamespaceMap2<N extends string = string> = Record<N, {}>;
export type Namespace2<L extends {}, N extends string = string> = {
  namespace: N;
  lens: t.Lens2<L>;
};

/**
 * Manager for working with [Lens] objects attached to a {map}
 * where the "keys" are the namespace "names".
 */
export type NamespaceManager2<N extends string = string> = t.Lifecycle & {
  readonly kind: 'crdt:namespace';
  readonly container: Readonly<NamespaceMap2<N>>;
  list<L extends {}>(): Namespace2<L, N>[];
  lens<L extends {}>(namespace: N, initial: L, options?: { typename?: string }): t.Lens2<L>;
  events(dispose$?: t.UntilObservable): t.LensEvents2<t.NamespaceMap2<N>>;
  typed<T extends string>(): NamespaceManager2<T>;
};

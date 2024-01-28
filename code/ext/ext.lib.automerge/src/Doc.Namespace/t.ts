import type { t } from '../common';

export type NamespaceMap<N extends string = string> = Record<N, {}>;
export type Namespace<L extends object, N extends string = string> = {
  namespace: N;
  lens: t.Lens<L>;
};

/**
 * Manager for working with [Lens] objects attached to a {map}
 * where the "keys" are the namespace "names".
 */
export type NamespaceManager<N extends string = string> = t.Lifecycle & {
  readonly kind: 'crdt:namespace';
  readonly container: Readonly<NamespaceMap<N>>;
  list<L extends object>(): Namespace<L, N>[];
  lens<L extends object>(namespace: N, initial: L, options?: { typename?: string }): t.Lens<L>;
  events(dispose$?: t.UntilObservable): t.LensEvents<t.NamespaceMap<N>>;
  typed<T extends string>(): NamespaceManager<T>;
};

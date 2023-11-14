import type { t } from './common';
export type * from './t.events';
export type * from './t.index';

type Uri = DocUri | string;
type Initial<T> = t.ImmutableNext<T>;

/**
 * The address of a document within the repo/store.
 */
export type DocUri = t.AutomergeUrl;

/**
 * An immutable/observable CRDT document reference.
 */
export type DocRef<T> = t.ImmutableRef<T, t.DocEvents<T>> & { toObject(): T };

/**
 * A complete reference-handle to a CRDT document
 * including the underlying automerge-repo handle.
 */
export type DocRefHandle<T> = DocRef<T> & {
  readonly uri: t.DocUri;
  readonly handle: t.DocHandle<T>;
};

/**
 * Generator function that produces a stongly-typed document
 * with a curried initial state.
 */
export type DocFactory<T> = (uri?: Uri) => Promise<t.DocRefHandle<T>>;

/**
 * Store (a repository of documents).
 */
export type Store = t.Lifecycle & {
  readonly repo: t.Repo;
  readonly doc: StoreDoc;
};
export type StoreDoc = {
  factory<T>(initial: Initial<T>): DocFactory<T>;
  exists(uri?: Uri, options?: { timeout?: t.Msecs }): Promise<boolean>;
  get<T>(uri?: Uri, options?: { timeout?: t.Msecs }): Promise<t.DocRefHandle<T> | undefined>;
  getOrCreate<T>(
    initial: Initial<T>,
    uri?: Uri,
    options?: { timeout?: t.Msecs },
  ): Promise<t.DocRefHandle<T>>;
};

export type StoreNetworkKind = 'BroadcastChannel' | 'Unknown';

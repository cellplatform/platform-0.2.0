import type { t } from './common';
export type * from './types.events';

type Initial<T> = t.ImmutableNext<T>;
type Uri = DocUri | string;

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
export type Store = {
  repo: t.Repo;
  doc: {
    findOrCreate<T>(initial: Initial<T>, uri?: Uri): Promise<t.DocRefHandle<T>>;
    factory<T>(initial: Initial<T>): DocFactory<T>;
    exists(uri?: Uri): boolean;
  };
};

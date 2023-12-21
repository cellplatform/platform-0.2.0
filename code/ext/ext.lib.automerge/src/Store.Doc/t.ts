import type { t } from './common';
export type * from './t.Events';

type Uri = t.DocUri | string;
type Initial<T> = t.ImmutableNext<T>;

/**
 * The address of a document within the repo/store.
 */
export type DocUri = t.AutomergeUrl;

/**
 * An immutable/observable CRDT document reference.
 */
export type DocRef<T> = t.ImmutableRef<T, t.DocEvents<T>> & {
  readonly is: { ready: boolean; deleted: boolean };
  toObject(): T;
};

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
 * Document access exposed from a store/repo.
 */
export type DocStore = {
  factory<T>(initial: Initial<T>): t.DocFactory<T>;
  exists(uri?: Uri, options?: TOptions): Promise<boolean>;
  get<T>(uri?: Uri, options?: TOptions): Promise<t.DocRefHandle<T> | undefined>;
  getOrCreate<T>(initial: Initial<T>, uri?: Uri, options?: TOptions): Promise<t.DocRefHandle<T>>;
  delete(uri?: Uri, options?: TOptions): Promise<boolean>;
};
type TOptions = { timeout?: t.Msecs };

/**
 * Common meta-data object that can decorate CRDT documents
 * on a hidden key, eg { .meta: {} }
 */
export type DocWithMeta = { '.meta': DocMeta };
export type DocMetaType = { name: string };
export type DocMeta = { type?: t.DocMetaType; ephemeral?: boolean };

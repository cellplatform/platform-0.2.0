import { type t } from './common';

export type * from './types.events';

/**
 * The address of a document within the repo/store.
 */
export type DocUri = t.AutomergeUrl;

/**
 * TODO 🐷
 * - t.ImmutableRef<T, E>
 * - URI (change type ImmutableRef<T>.instance → uri ?)
 */

/**
 * An immutable/observable CRDT document reference.
 */
export type DocRef<T> = t.Immutable<T> & {
  events(dispose?: t.UntilObservable): t.DocEvents<T>;
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

import { type t } from './common';

export type DocUri = t.AutomergeUrl;
export type DocRefArgs<T> = { initial: t.DocChange<T>; uri?: t.AutomergeUrl };

/**
 * A reference-handle to a CRDT document.
 */
export type DocRef<T> = {
  readonly uri: t.DocUri;
  readonly current: T;
  change(fn: DocChange<T>): void;
};

export type DocRefHandle<T> = DocRef<T> & {
  readonly handle: t.DocHandle<T>;
};

/**
 * Mutates a document safely.
 */
export type DocChange<T> = (doc: T) => void;

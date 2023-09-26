import { type t } from './common';

/**
 * A reference-handle to a CRDT document.
 */
export type DocRefHandle<T> = {
  readonly uri: t.AutomergeUrl;
  readonly current: T;
  readonly change: DocChanger<T>;
  readonly handle: t.DocHandle<T>;
};

/**
 * Mutates a document safely.
 */
export type DocChange<T> = (doc: T) => void;
export type DocChanger<T> = (fn: DocChange<T>) => void;

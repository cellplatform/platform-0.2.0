export type * from './types.events';
import { type t } from './common';

export type DocUri = t.AutomergeUrl;

/**
 * A reference-handle to a CRDT document.
 */
export type DocRef<T> = {
  readonly current: T;
  change(fn: DocChange<T>): void;
};

export type DocRefHandle<T> = t.DocRef<T> & {
  readonly uri: t.DocUri;
  readonly handle: t.DocHandle<T>;
  events(dispose?: t.Observable<any>): t.DocEvents<T>;
  toObject(): T;
};

/**
 * Mutates a document safely.
 */
export type DocChange<T> = (doc: T) => void;

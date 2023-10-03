import { type t } from './common';

export type * from './types.events';
export type DocUri = t.AutomergeUrl;

/**
 * A reference-handle to a CRDT document.
 */
export type DocRef<T> = t.Immutable<T> & {
  readonly uri: t.DocUri;
  readonly handle: t.DocHandle<T>;
  events(dispose?: t.Observable<any>): t.DocEvents<T>;
  toObject(): T;
};

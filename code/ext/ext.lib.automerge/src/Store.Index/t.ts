import type { t, A } from './common';
export type * from './t.Events';

type Uri = t.DocUri | string;

/**
 * A CRDT that represents an index of a store/repo.
 */
export type StoreIndex = {
  readonly kind: 'store:index';
  readonly store: t.Store;
  readonly doc: t.DocRefHandle<t.RepoIndex>;
  readonly total: number;
  exists(documentUri: Uri): boolean;
  add(documentUri: Uri): boolean;
  remove(documentUri: Uri): boolean;
  events(dispose$?: t.UntilObservable): t.StoreIndexEvents;
};

/**
 * Index of documents within a store/repository.
 */
export type RepoIndex = { docs: RepoIndexItem[] };
export type RepoIndexItem = {
  uri: Uri;
  name?: string;
  shared?: RepoIndexItemShared;
};

/**
 * Record of the share/publish status of the document.
 */
export type RepoIndexItemShared = {
  count: A.Counter;
  current: boolean;
};

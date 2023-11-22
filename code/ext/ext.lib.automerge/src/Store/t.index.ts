import type { t } from './common';

type Uri = t.DocUri | string;

/**
 * A CRDT document that represents an index of a store/repo.
 */
export type StoreIndex = {
  readonly kind: 'store:index';
  readonly store: t.Store;
  readonly doc: t.DocRefHandle<t.RepoIndex>;
  readonly total: number;
  exists(documentUri: Uri): boolean;
  add(documentUri: Uri): boolean;
  remove(documentUri: Uri): boolean;
};

/**
 * Index of documents within a store/repository.
 */
export type RepoIndex = { docs: RepoIndexItem[] };
export type RepoIndexItem = { uri: Uri; name?: string };

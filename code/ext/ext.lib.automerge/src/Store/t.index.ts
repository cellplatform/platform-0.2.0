import type { t } from './common';

type Uri = t.DocUri | string;

export type StoreIndex = {
  readonly kind: 'store:index';
  readonly store: t.Store;
  readonly ref: t.DocRefHandle<t.RepoIndex>;
  readonly current: t.RepoIndex;
  exists(uri: Uri): boolean;
};

/**
 * Index of documents within a store/repository.
 */
export type RepoIndex = { docs: RepoIndexItem[] };
export type RepoIndexItem = { uri: Uri; name?: string };

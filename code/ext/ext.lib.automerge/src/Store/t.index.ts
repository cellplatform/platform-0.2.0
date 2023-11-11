import type { t } from './common';

type Uri = t.DocUri | string;

export type StoreIndex = {
  kind: 'store:index';
  store: t.Store;
  index: t.DocRefHandle<t.RepoIndex>;
};

/**
 * Index of documents within a store/repository.
 */
export type RepoIndex = { docs: RepoIndexItem[] };
export type RepoIndexItem = { uri: Uri; name?: string };

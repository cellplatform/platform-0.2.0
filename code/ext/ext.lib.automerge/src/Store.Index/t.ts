import type { t } from './common';
export type * from './t.Events';

type Uri = t.DocUri | string;
type AddSubject = { uri: Uri; name?: string };

/**
 * A CRDT that represents an index of a store/repo.
 */
export type StoreIndex = {
  readonly kind: 'store:index';
  readonly store: t.Store;
  readonly doc: t.DocRefHandle<t.RepoIndex>;
  total(filter?: t.RepoIndexFilter): number;
  add(doc: AddSubject | AddSubject[]): Promise<number>;
  remove(uri: Uri | Uri[]): Promise<number>;
  exists(uri: Uri | Uri[]): boolean;
  events(dispose$?: t.UntilObservable): t.StoreIndexEvents;
};

export type RepoIndexFilter = (e: RepoIndexFilterArgs, index: number) => boolean;
export type RepoIndexFilterArgs = { doc: t.RepoIndexDoc; index: number };

/**
 * Index of documents within a store/repository.
 */
export type RepoIndex = { docs: RepoIndexDoc[] };
export type RepoIndexDoc = {
  uri: Uri;
  name?: string;
  shared?: RepoIndexItemShared;
  meta?: RepoIndexDocMeta;
};
export type RepoIndexDocMeta = Pick<t.DocMeta, 'ephemeral'>;

/**
 * Record of the share/publish status of the document.
 */
export type RepoIndexItemShared = {
  current: boolean;
};

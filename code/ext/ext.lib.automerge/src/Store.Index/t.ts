import type { t } from './common';
export type * from './t.Events';

type Uri = string;
type UriInput = Uri | Uri[];
type AddSubject = { uri: Uri; name?: string };

/**
 * A CRDT that represents an index of a store/repo.
 */
export type StoreIndex = {
  readonly kind: 'store:index';
  readonly store: t.Store;
  readonly doc: t.DocRefHandle<t.RepoIndex>;
  events(dispose$?: t.UntilObservable): t.StoreIndexEvents;
  exists(uri: UriInput): boolean;
  total(filter?: t.RepoIndexFilter): number;
  add(doc: AddSubject | AddSubject[]): Promise<number>;
  remove(uri: UriInput): number;
  toggleShared(uri: UriInput, options?: { value?: boolean }): { uri: Uri; shared: boolean }[];
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

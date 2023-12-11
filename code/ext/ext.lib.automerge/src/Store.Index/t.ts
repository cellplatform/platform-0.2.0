import type { t } from './common';

export type * from './t.Events';
export type * from './t.Shared';

type Uri = string;
type UriInput = Uri | Uri[];
type AddSubject = { uri: Uri; name?: string; shared?: boolean };

/**
 * A CRDT that represents an index of a store/repo.
 */
export type StoreIndex = {
  readonly kind: 'store:index';
  readonly store: t.Store;
  readonly doc: t.DocRefHandle<t.StoreIndexDoc>;
  readonly toggleShared: t.StoreIndexToggleShared;
  events(dispose$?: t.UntilObservable): t.StoreIndexEvents;
  exists(uri: UriInput): boolean;
  total(filter?: t.StoreIndexFilter): number;
  add(doc: AddSubject | AddSubject[]): Promise<number>;
  remove(uri: UriInput): number;
};

export type StoreIndexFilter = (e: StoreIndexFilterArgs, index: number) => boolean;
export type StoreIndexFilterArgs = { doc: t.StoreIndexDocItem; index: number };

/**
 * Index of documents within a store/repository.
 */
export type StoreIndexDoc = { docs: StoreIndexDocItem[] };
export type StoreIndexDocItem = {
  uri: Uri;
  name?: string;
  meta?: RepoIndexDocMeta;
  shared?: t.StoreIndexItemShared;
};

export type RepoIndexDocMeta = Pick<t.DocMeta, 'ephemeral'>;

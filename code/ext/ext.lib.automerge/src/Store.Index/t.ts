import type { t } from './common';

export type * from './t.Events';
export type * from './t.Shared';

type Uri = string;
type UriInput = Uri | Uri[];
type AddDoc = { uri: Uri; name?: string; shared?: boolean };

/**
 * A CRDT that represents an index of a store/repo.
 */
export type StoreIndexState = {
  readonly kind: 'store.index:state';
  readonly store: t.Store;
  readonly doc: t.DocRefHandle<t.StoreIndex>;
  readonly toggleShared: t.StoreIndexToggleShared;
  events(dispose$?: t.UntilObservable): t.StoreIndexEvents;
  exists(uri: UriInput): boolean;
  total(filter?: t.StoreIndexFilter): number;
  add(doc: AddDoc | AddDoc[]): Promise<number>;
  remove(uri: UriInput): number;
};

export type StoreIndexFilter = (e: StoreIndexFilterArgs, index: number) => boolean;
export type StoreIndexFilterArgs = { doc: t.StoreIndexDoc; index: number };

/**
 * Index of documents within a store/repository.
 */
export type StoreIndex = { docs: t.StoreIndexDoc[] };
export type StoreIndexDoc = {
  uri: Uri;
  name?: string;
  meta?: StoreIndexDocMeta;
  shared?: t.StoreIndexItemShared;
};
export type StoreIndexDocMeta = Pick<t.DocMeta, 'ephemeral'>;

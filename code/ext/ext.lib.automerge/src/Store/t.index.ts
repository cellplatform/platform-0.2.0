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
  events(dispose$?: t.UntilObservable): t.StoreIndexEvents;
};

/**
 * Index of documents within a store/repository.
 */
export type RepoIndex = { docs: RepoIndexItem[] };
export type RepoIndexItem = { uri: Uri; name?: string };

/**
 * Events
 */
export type StoreIndexEvents = t.Lifecycle & {
  readonly $: t.Observable<t.StoreIndexEvent>;
  readonly changed$: t.Observable<t.DocChanged<t.RepoIndex>>;
  readonly added$: t.Observable<StoreIndexAdded>;
  readonly removed$: t.Observable<StoreIndexRemoved>;
};

export type StoreIndexEvent =
  | t.DocEvent<t.RepoIndex>
  | StoreIndexAddedEvent
  | StoreIndexRemovedEvent;

export type StoreIndexAddedEvent = {
  type: 'crdt:store:index/Added';
  payload: StoreIndexAdded;
};
export type StoreIndexAdded = { index: number; item: t.RepoIndexItem };

export type StoreIndexRemovedEvent = {
  type: 'crdt:store:index/Removed';
  payload: StoreIndexRemoved;
};
export type StoreIndexRemoved = { index: number; item: t.RepoIndexItem };

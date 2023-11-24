import type { t } from './common';

export type StoreIndexEvents = t.Lifecycle & {
  readonly $: t.Observable<t.StoreIndexEvent>;
  readonly changed$: t.Observable<t.DocChanged<t.RepoIndex>>;
  readonly added$: t.Observable<StoreIndexAdded>;
  readonly removed$: t.Observable<StoreIndexRemoved>;
};

/**
 * Events
 */
export type StoreIndexEvent =
  | t.DocEvent<t.RepoIndex>
  | StoreIndexAddedEvent
  | StoreIndexRemovedEvent;

export type StoreIndexAddedEvent = {
  type: 'crdt:store:index/Added';
  payload: StoreIndexAdded;
};
export type StoreIndexAdded = { index: number; total: number; item: t.RepoIndexDoc };

export type StoreIndexRemovedEvent = {
  type: 'crdt:store:index/Removed';
  payload: StoreIndexRemoved;
};
export type StoreIndexRemoved = { index: number; total: number; item: t.RepoIndexDoc };

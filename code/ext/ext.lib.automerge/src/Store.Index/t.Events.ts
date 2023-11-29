import type { t } from './common';

export type StoreIndexEvents = t.Lifecycle & {
  readonly $: t.Observable<t.StoreIndexEvent>;
  readonly changed$: t.Observable<t.DocChanged<t.RepoIndex>>;
  readonly added$: t.Observable<t.StoreIndexItem>;
  readonly removed$: t.Observable<t.StoreIndexItem>;
  readonly shared$: t.Observable<t.StoreIndexItem>;
};

/**
 * Events
 */
export type StoreIndexEvent =
  | t.DocEvent<t.RepoIndex>
  | StoreIndexAddedEvent
  | StoreIndexRemovedEvent
  | StoreIndexSharedEvent;

export type StoreIndexAddedEvent = { type: 'crdt:store:index/Added'; payload: StoreIndexItem };
export type StoreIndexRemovedEvent = { type: 'crdt:store:index/Removed'; payload: StoreIndexItem };
export type StoreIndexSharedEvent = { type: 'crdt:store:index/Shared'; payload: StoreIndexItem };

export type StoreIndexItem = {
  index: number;
  total: number;
  item: t.RepoIndexDoc;
};

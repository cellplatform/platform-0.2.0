import type { t } from './common';

export type RepoListEvents = t.Lifecycle & {
  readonly active$: t.Observable<t.RepoListActiveChangedEventArgs>;
  readonly deleting$: t.Observable<t.RepoListDeletingEventArgs>;
  readonly deleted$: t.Observable<t.RepoListDeletedEventArgs>;
};

/**
 * Events
 */
export type RepoListEvent = RepoListActiveChangedEvent | RepoListCmdEvent;
export type RepoListCmdEvent = RepoListDeletingEvent | RepoListDeletedEvent;

export type RepoListActiveChangedEvent = {
  type: 'crdt:RepoList:active/changed';
  payload: RepoListActiveChangedEventArgs;
};
export type RepoListActiveChangedEventArgs = {
  store: t.Store;
  index: t.StoreIndex;
  position: { index: number; total: number };
  kind: t.RepoItemData['kind'];
  item: t.StoreIndexItem;
  focused: boolean;
};

/**
 * Deleting
 */
export type RepoListDeletingEvent = {
  type: 'crdt:RepoList:active/deleting';
  payload: RepoListDeletingEventArgs;
};
export type RepoListDeletingEventArgs = RepoListDeletedEventArgs & {
  readonly cancelled: boolean;
  cancel(): void;
};

/**
 * Deleted
 */
export type RepoListDeletedEvent = {
  type: 'crdt:RepoList:active/deleted';
  payload: RepoListDeletedEventArgs;
};
export type RepoListDeletedEventArgs = {
  readonly uri: string;
  readonly store: t.Store;
  readonly index: t.StoreIndex;
  readonly position: { index: number; total: number };
};

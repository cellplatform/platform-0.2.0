import type { t } from './common';

export type RepoListEvents = t.Lifecycle & {
  readonly active$: t.Observable<t.RepoListActiveEventArgs>;
};

/**
 * Events
 */
export type RepoListEvent = RepoListActiveChangedEvent;

export type RepoListActiveChangedEvent = {
  type: 'crdt:RepoList:active/changed';
  payload: RepoListActiveEventArgs;
};
export type RepoListActiveEventArgs = {
  store: t.Store;
  index: t.StoreIndex;
  position: { index: number; total: number };
  kind: t.RepoItemData['kind'];
  item: t.StoreIndexDocItem;
  focused: boolean;
};

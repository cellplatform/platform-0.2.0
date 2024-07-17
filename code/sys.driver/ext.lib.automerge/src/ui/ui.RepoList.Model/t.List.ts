import type { t } from './common';

export type RepoListBehavior =
  | 'Focus.OnLoad'
  | 'Focus.OnArrowKey'
  | 'Shareable'
  | 'Deletable'
  | 'Copyable';

/**
 * Model: List
 */
export type RepoListState = t.LabelListState;

export type GetRepoListModel = () => RepoListModel;
export type RepoListModel = t.Lifecycle & {
  store: t.WebStore;
  index: t.WebStoreIndex;
  list: { state: t.RepoListState; dispatch: t.LabelListDispatch };
  filter: t.StoreIndexFilter;
  handlers: t.RepoListHandlers;
  behaviors: t.RepoListBehavior[];
  events(dispose$?: t.UntilObservable): t.RepoListEvents;
};

/**
 * Event Handlers
 */
export type RepoListHandlers = {
  onShareClick?: t.RepoListClickHandler;
  onDatabaseClick?: t.RepoListClickHandler;
  onActiveChanged?: t.RepoListActiveHandler;
};

export type RepoListClickHandler = (e: RepoListClickHandlerArgs) => void;
export type RepoListClickHandlerArgs = {
  store: t.Store;
  index: t.StoreIndexState;
  position: { index: number; total: number };
  item: t.StoreIndexItem;
};

export type RepoListActiveHandler = (e: t.RepoListActiveChangedEventArgs) => void;

import type { t } from './common';

/**
 * Model: List
 */
export type RepoListState = t.LabelListState;
export type RepoListModel = t.Lifecycle & {
  ctx: t.GetRepoListCtx;
  store: t.WebStore;
  index: t.WebStoreIndex;
  list: { state: t.RepoListState; dispatch: t.LabelListDispatch };
  events(dispose$?: t.UntilObservable): t.RepoListEvents;
};

/**
 * Model: List Context
 */
export type GetRepoListCtx = () => RepoListCtx;
export type RepoListCtx = {
  store: t.Store;
  index: t.StoreIndexState;
  list: { state: t.RepoListState; dispatch: t.LabelListDispatch };
  handlers: t.RepoListHandlers;
  dispose$?: t.UntilObservable;
  filter: t.StoreIndexFilter;
  events: (dispose$?: t.UntilObservable) => t.RepoListEvents;
};

export type RepoItemCtx = {
  state: t.RepoItemState;
  events: t.RepoItemEvents;
  dispatch: t.LabelItemDispatch;
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
  item: t.StoreIndexDoc;
};

export type RepoListActiveHandler = (e: t.RepoListActiveEventArgs) => void;

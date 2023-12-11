import type { t } from './common';

/**
 * Model: List
 */
export type RepoListState = t.LabelListState;
export type RepoListModel = t.Lifecycle & {
  ctx: t.RepoListCtxGet;
  store: t.WebStore;
  index: t.WebStoreIndex;
  list: { state: t.RepoListState; dispatch: t.LabelListDispatch };
};

/**
 * Model: List Context
 */
export type RepoListCtxGet = () => RepoListCtx;
export type RepoListCtx = {
  list: { state: t.RepoListState; dispatch: t.LabelListDispatch };
  store: t.Store;
  index: t.StoreIndex;
  handlers: t.RepoListHandlers;
  dispose$?: t.UntilObservable;
  filter: t.StoreIndexFilter;
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
  onSelection?: t.RepoListSelectionHandler;
};

export type RepoListClickHandler = (e: RepoListClickHandlerArgs) => void;
export type RepoListClickHandlerArgs = {
  store: t.Store;
  index: t.StoreIndex;
  position: { index: number; total: number };
  item: t.StoreIndexDocItem;
};

export type RepoListSelectionHandler = (e: RepoListSelectionHandlerArgs) => void;
export type RepoListSelectionHandlerArgs = {
  store: t.Store;
  index: t.StoreIndex;
  position: { index: number; total: number };
  kind: t.RepoItemData['kind'];
  item: t.StoreIndexDocItem;
};
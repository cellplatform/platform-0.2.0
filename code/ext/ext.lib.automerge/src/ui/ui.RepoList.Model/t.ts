import type { t } from './common';

/**
 * Model: Item
 */
export type RepoListAction = 'Item:Left' | 'Item:Right';
export type RepoItem = t.LabelItem<t.RepoListAction, t.RepoItemData>;
export type RepoItemState = t.LabelItemState<t.RepoListAction, t.RepoItemData>;
export type RepoItemRenderers = t.LabelItemRenderers<t.RepoListAction>;
export type RepoItemEvents = t.LabelItemEvents<RepoListAction, RepoItemData>;
export type RepoArray = t.LabelListArray<t.RepoListAction, t.RepoItemData>;

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
 * Model: Data
 */
export type GetRepoLabelItem = t.GetLabelItem<t.RepoListAction, t.RepoItemData>;
export type RepoItemData = {
  mode: 'Add' | 'Doc';
  uri?: string;
};

/**
 * Model: Context
 */
export type RepoListCtxGet = () => RepoListCtx;
export type RepoListCtx = {
  list: { state: t.RepoListState; dispatch: t.LabelListDispatch };
  store: t.Store;
  index: t.StoreIndex;
  handlers: t.RepoListHandlers;
  dispose$?: t.UntilObservable;
  filter: t.RepoIndexFilter;
};

export type RepoItemCtx = {
  state: t.RepoItemState;
  events: t.RepoItemEvents;
  dispatch: t.LabelItemDispatch;
};

/**
 * Events
 */
export type RepoListHandlers = {
  onShareClick?: t.RepoListClickHandler;
  onDatabaseClick?: t.RepoListClickHandler;
};

export type RepoListClickHandler = (e: RepoListClickHandlerArgs) => void;
export type RepoListClickHandlerArgs = {
  store: t.Store;
  index: t.StoreIndex;
  item: t.RepoIndexDoc;
  position: { index: number; total: number };
};

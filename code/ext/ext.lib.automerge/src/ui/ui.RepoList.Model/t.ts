import type { t } from './common';

/**
 * Model: Item
 */
export type RepoListAction = 'Store:Left';
export type RepoItem = t.LabelItem<t.RepoListAction, RepoItemData>;
export type RepoItemState = t.LabelItemState<RepoListAction, RepoItemData>;
export type RepoItemRenderers = t.LabelItemRenderers<t.RepoListAction>;
export type RepoItemEvents = t.LabelItemEvents<RepoListAction, RepoItemData>;

/**
 * Model: List
 */
export type RepoListState = t.LabelListState;

export type RepoListModel = t.Lifecycle & {
  ctx: t.RepoListCtxGet;
  index: t.StoreIndex;
  list: { state: t.RepoListState; dispatch: t.LabelListDispatch };
};

/**
 * Model: Data
 */
export type RepoItemData = {
  mode: 'Add' | 'Doc';
  uri?: string;
};

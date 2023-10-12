import { type t } from './common';

/**
 * <Component>
 */
export type RepoListProps = {
  style?: t.CssValue;
};

/**
 * Model: Context
 */
export type GetRepoListCtx = () => RepoListCtx;
export type RepoListCtx = { list: RepoListState };

/**
 * Model: Item
 */
export type RepoListAction = 'Store:Left';
export type RepoItem = t.LabelItem<t.RepoListAction, RepoItemData>;
export type RepoItemState = t.LabelItemState<RepoListAction, RepoItemData>;
export type RepoItemRenderers = t.LabelItemRenderers<t.RepoListAction>;

/**
 * Model: List
 */
export type RepoListState = t.PatchState<t.RepoList>;
export type RepoList = { state: t.LabelListState; items: t.RepoItemState[] };

/**
 * Model: Data
 */
export type RepoItemData = {
  mode: 'Add' | 'Doc';
};

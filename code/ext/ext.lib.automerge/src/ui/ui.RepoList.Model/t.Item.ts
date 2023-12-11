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
 * Model: Item Data
 */
export type GetRepoLabelItem = t.GetLabelItem<t.RepoListAction, t.RepoItemData>;
export type RepoItemData = {
  kind: 'Add' | 'Doc';
  uri?: string;
};

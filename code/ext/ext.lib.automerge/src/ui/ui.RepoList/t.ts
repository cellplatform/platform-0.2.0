import { type t } from './common';

/**
 * API: Imperative handle reference.
 */
export type RepoListRef = t.LabelListDispatch & {
  store: t.WebStore;
};

/**
 * <Component>
 */
export type RepoListProps = {
  store: t.WebStore;
  renderCount?: t.RenderCountProps;
  style?: t.CssValue;
  onReady?: t.RepoListReadyHandler;
};

/**
 * Model: Context
 */
export type GetRepoListCtx = () => RepoListCtx;
export type RepoListCtx = { list: RepoListState; dispatch: t.LabelListDispatch };

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
export type RepoListState = t.LabelListState;

/**
 * Model: Data
 */
export type RepoItemData = {
  mode: 'Add' | 'Doc';
};

/**
 * Events
 */
export type RepoListReadyHandler = (e: t.RepoListRef) => void;

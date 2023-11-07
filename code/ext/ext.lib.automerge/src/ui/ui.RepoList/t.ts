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
  behavior?: t.RepoListBehavior;
  renderCount?: t.RenderCountProps;
  tabIndex?: number;
  style?: t.CssValue;
  onReady?: t.RepoListReadyHandler;
};

export type RepoListBehavior = {
  focusOnLoad?: boolean;
  focusOnArrowKey?: boolean;
};

/**
 * Model: Context
 */
export type GetRepoListCtx = () => RepoListCtx;
export type RepoListCtx = {
  list: RepoListState;
  dispatch: t.LabelListDispatch;
  dispose$?: t.UntilObservable;
};

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

import { type t } from './common';

/**
 * API: Imperative handle reference.
 */
export type RepoListRef = t.LabelListDispatch & { store: t.Store };

/**
 * <Component>
 */
export type RepoListProps = {
  list?: t.RepoListState;
  behavior?: t.RepoListBehavior;
  renderCount?: t.RenderCountProps;
  tabIndex?: number;
  style?: t.CssValue;
};

export type RepoListBehavior = {
  focusOnLoad?: boolean;
  focusOnArrowKey?: boolean;
};

/**
 * Model: Context
 */
export type RepoListCtxGet = () => RepoListCtx;
export type RepoListCtx = {
  list: { state: t.RepoListState; dispatch: t.LabelListDispatch };
  store: t.Store;
  index: t.StoreIndex;
  dispose$?: t.UntilObservable;
};

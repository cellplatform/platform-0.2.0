import { type t } from './common';

/**
 * API: Imperative handle reference.
 */
export type RepoListRef = t.LabelListDispatch & { store: t.Store };
export type RepoListBehavior = 'Focus.OnLoad' | 'Focus.OnArrowKey';

/**
 * <Component>
 */
export type RepoListProps = {
  list?: t.RepoListState | t.RepoListModel;
  behaviors?: t.RepoListBehavior[];
  renderCount?: t.RenderCountProps;
  tabIndex?: number;
  style?: t.CssValue;
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

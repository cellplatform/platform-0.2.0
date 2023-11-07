import { type t } from './common';

/**
 * API: Imperative handle reference.
 */
export type RepoListRef = t.LabelListDispatch & { store: t.Store };

/**
 * <Component>
 */
export type RepoListProps = {
  store: t.Store;
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
export type RepoListCtxGet = () => RepoListCtx;
export type RepoListCtx = {
  list: t.RepoListState;
  store: t.Store;
  dispatch: t.LabelListDispatch;
  dispose$?: t.UntilObservable;
};

/**
 * Events
 */
export type RepoListReadyHandler = (e: t.RepoListReadyHandlerArgs) => void;
export type RepoListReadyHandlerArgs = { ref: t.RepoListRef };

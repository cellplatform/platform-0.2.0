import { type t } from './common';

/**
 * API: Imperative handle reference.
 */
export type RepoListRef = Omit<t.LabelListDispatch, 'cmd'> & { store: t.Store };

/**
 * Action.
 */
export type RepoListActionCtx = { kind: 'Share' | 'Delete' };

/**
 * <Component>
 */
export type RepoListProps = {
  model?: t.RepoListModel;
  newlabel?: string;
  renderCount?: t.RenderCountProps;
  tabIndex?: number;
  style?: t.CssValue;
  onReady?: RepoListReadyHandler;
};

/**
 * Events
 */
export type RepoListReadyHandler = (e: RepoListReadyHandlerArgs) => void;
export type RepoListReadyHandlerArgs = { ref: RepoListRef };

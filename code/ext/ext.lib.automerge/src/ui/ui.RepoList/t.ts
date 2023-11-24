import { type t } from './common';

/**
 * API: Imperative handle reference.
 */
export type RepoListRef = t.LabelListDispatch & { store: t.Store };
export type RepoListBehavior = 'Focus.OnLoad' | 'Focus.OnArrowKey' | 'Shareable';

/**
 * Action
 */
export type RepoListActionCtx = { kind: 'Share' };

/**
 * <Component>
 */
export type RepoListProps = {
  list?: t.RepoListModel;
  behaviors?: t.RepoListBehavior[];
  renderCount?: t.RenderCountProps;
  tabIndex?: number;
  style?: t.CssValue;
};

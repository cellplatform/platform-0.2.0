import { type t } from './common';

/**
 * API: Imperative handle reference.
 */
export type RepoListRef = Omit<t.LabelListDispatch, 'cmd'> & { store: t.Store };
export type RepoListBehavior = 'Focus.OnLoad' | 'Focus.OnArrowKey' | 'Shareable';

/**
 * Action
 */
export type RepoListActionCtx = { kind: 'Share' | 'Delete' };

/**
 * <Component>
 */
export type RepoListProps = {
  list?: t.RepoListModel;
  behaviors?: t.RepoListBehavior[];
  newlabel?: string;
  renderCount?: t.RenderCountProps;
  tabIndex?: number;
  style?: t.CssValue;
};

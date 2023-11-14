import { type t } from './common';

export * from '../common';
export { Data, Model } from '../ui.RepoList.Model';

/**
 * Constants
 */
const behavior: t.RepoListBehavior = {
  focusOnArrowKey: false,
  focusOnLoad: false,
};

export const DEFAULTS = {
  displayName: 'RepoList',
  behavior,
  tabIndex: 0,
} as const;

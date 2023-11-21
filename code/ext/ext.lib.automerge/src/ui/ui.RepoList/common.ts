import { type t } from '../common';
export * from '../common';
export { Data, Model } from '../ui.RepoList.Model';

/**
 * Constants
 */

export const DEFAULTS = {
  displayName: 'RepoList',
  tabIndex: 0,
  behaviors: {
    get all(): t.RepoListBehaviorKind[] {
      return ['Focus.OnLoad', 'Focus.OnArrowKey'];
    },
    get defaults(): t.RepoListBehaviorKind[] {
      return [];
    },
  },
} as const;

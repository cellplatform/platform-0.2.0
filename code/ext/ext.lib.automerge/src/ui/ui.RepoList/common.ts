import { type t } from '../common';

export * from '../common';
export { Data, Model } from '../ui.RepoList.Model';

/**
 * Constants
 */

export const DEFAULTS = {
  displayName: 'RepoList',
  newlabel: 'new database',
  behaviors: {
    get all(): t.RepoListBehavior[] {
      return ['Focus.OnLoad', 'Focus.OnArrowKey', 'Shareable'];
    },
    get default(): t.RepoListBehavior[] {
      return [];
    },
  },
} as const;

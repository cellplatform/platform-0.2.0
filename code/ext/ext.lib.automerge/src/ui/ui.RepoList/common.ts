import { type t } from '../common';

export * from '../common';
export { Data, Model } from '../ui.RepoList.Model';
import { DEFAULTS as MODEL_DEFAULTS } from '../ui.RepoList.Model/common';

/**
 * Constants
 */

export const DEFAULTS = {
  displayName: 'RepoList',
  newlabel: 'new database',
  tabIndex: 0,
  behaviors: MODEL_DEFAULTS.behaviors,
} as const;

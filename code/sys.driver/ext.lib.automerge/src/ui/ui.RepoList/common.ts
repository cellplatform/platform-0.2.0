import { Pkg } from '../common';
import { DEFAULTS as MODEL_DEFAULTS } from '../ui.RepoList.Model/common';

export * from '../common';
export { Data, Model } from '../ui.RepoList.Model';
export { Ref } from '../ui.RepoList.Model/Ref';

/**
 * Constants
 */

export const DEFAULTS = {
  displayName: `${Pkg.name}:RepoList`,
  newlabel: 'new database',
  tabIndex: 0,
  behaviors: MODEL_DEFAULTS.behaviors,
} as const;

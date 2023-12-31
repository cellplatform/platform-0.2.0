import { type t } from './common';
import { DEFAULTS as BASE } from '../ui.RepoList';

export * from '../common';
export { RepoList } from '../ui.RepoList';

/**
 * Constants
 */
export const DEFAULTS = {
  ...BASE,
  displayName: 'RepoList.Virtual',
} as const;

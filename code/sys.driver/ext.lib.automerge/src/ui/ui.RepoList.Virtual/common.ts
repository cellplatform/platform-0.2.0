import { DEFAULTS as BASE } from '../ui.RepoList';
import { Pkg } from './common';

export * from '../common';
export { RepoList } from '../ui.RepoList';

/**
 * Constants
 */
export const DEFAULTS = {
  ...BASE,
  displayName: `${Pkg.name}:RepoList.Virtual`,
} as const;

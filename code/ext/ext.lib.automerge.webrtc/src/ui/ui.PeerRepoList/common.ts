import { Pkg } from './common';
export * from '../common';

/**
 * Constants
 */
export const DEFAULTS = {
  displayName: `${Pkg.name}.PeerRepoList`,
  focusPeerOnLoad: true,
} as const;

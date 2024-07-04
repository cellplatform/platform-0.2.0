import { Pkg, type t } from './common';
export * from '../common';

/**
 * Constants
 */
export const DEFAULTS = {
  displayName: `${Pkg.name}:Video`,
  muted: true,
  empty: 'Nothing to display.',
} as const;

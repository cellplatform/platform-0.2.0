import { Pkg, type t } from './common';
export * from '../common';

/**
 * Constants
 */
export const DEFAULTS = {
  displayName: `${Pkg.name}:Flip`,
  speed: 300,
} as const;

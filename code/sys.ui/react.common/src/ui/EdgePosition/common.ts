import { Pkg, type t } from '../common';
export * from '../common';

/**
 * Constants
 */
const position: t.EdgePos = ['center', 'center'];
export const DEFAULTS = {
  displayName: `${Pkg.name}:EdgePosition`,
  position,
} as const;

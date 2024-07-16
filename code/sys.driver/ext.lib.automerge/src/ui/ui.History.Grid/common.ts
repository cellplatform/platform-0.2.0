import { Pkg } from './common';

export * from '../common';

/**
 * Constants
 */
export const DEFAULTS = {
  displayName: `${Pkg.name}:History.Grid`,
  hash: { length: 6 },
  empty: { message: 'nothing to display' },
} as const;

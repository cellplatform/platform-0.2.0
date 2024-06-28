import { Pkg, type t } from '../common';
export * from '../common';

/**
 * Constants
 */
const name = 'UNNAMED'; // TODO 🐷
export const DEFAULTS = {
  name,
  displayName: `${Pkg.name}.${name}`,
} as const;

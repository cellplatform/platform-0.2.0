import { Pkg, type t } from '../common';
export * from '../common';

/**
 * Constants
 */
const name = 'HashView';
export const DEFAULTS = {
  name,
  displayName: `${Pkg.name}.${name}`,
  title: 'Hash',
} as const;

import { Pkg, type t } from '../common';
export * from '../common';

/**
 * Constants
 */
const name = 'CmdBar.Stateful';
export const DEFAULTS = {
  name,
  displayName: `${Pkg.name}.${name}`,
} as const;

import { Pkg, type t } from './common';
export * from '../common';

/**
 * Constants
 */
export const DEFAULTS = {
  displayName: `${Pkg.name}:Connector.MediaToolbar`,
  selected: false,
  focused: false,
} as const;

import { Pkg, type t } from '../common';
export * from '../common';

/**
 * Constants
 */
export const DEFAULTS = {
  displayName: {
    KeyHint: `${Pkg.name}.KeyHint`,
    KeyHintCombo: `${Pkg.name}.KeyHint.Combo`,
  },
} as const;

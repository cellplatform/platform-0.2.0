import { Pkg, type t } from '../common';
export * from '../common';

/**
 * Constants
 */
export const DEFAULTS = {
  displayName: {
    HintKey: `${Pkg.name}.HintKey`,
    HintKeys: `${Pkg.name}.HintKeys`,
  },
} as const;

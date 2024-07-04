import { Pkg, DEFAULTS as BASE } from '../common';

export * from '../common';
export * from './common.Calc';

/**
 * Constants
 */
export const DEFAULTS = {
  displayName: `${Pkg.name}:ModuleList`,
  qs: BASE.qs,
  list: { minWidth: 360 },
  useAnchorLinks: true,
  showParamDev: true,
} as const;

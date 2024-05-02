import { DEFAULTS as BASE } from '../common';

export * from '../common';
export * from './common.Calc';

/**
 * Constants
 */
export const DEFAULTS = {
  qs: BASE.qs,
  list: { minWidth: 550 },
} as const;

import { DevBase, DEFAULTS as BASE } from '../common';

export * from '../common';
export const SpecList = DevBase.SpecList;

/**
 * Constants
 */
export const DEFAULTS = {
  focusOnReady: true,
  qs: BASE.qs,
} as const;

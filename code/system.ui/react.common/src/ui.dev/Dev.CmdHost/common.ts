import { DEFAULTS as BASE, DevBase } from '../common';

export * from '../common';
export * from './common.Filter';
export const SpecList = DevBase.SpecList;

/**
 * Constants
 */
export const DEFAULTS = {
  focusOnReady: true,
  qs: BASE.qs,
} as const;

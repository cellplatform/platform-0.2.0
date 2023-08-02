import { DEFAULTS } from './common';

/**
 * Helpers
 */
export const Wrangle = {
  percent(value?: number) {
    if (!value) return DEFAULTS.percent;
    return Math.max(0, Math.min(1, value));
  },
} as const;

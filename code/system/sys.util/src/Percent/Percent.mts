import { type t } from '../common';

/**
 * Tools for working with numbers that represent percentages.
 */
export const Percent = {
  /**
   * Converts a value to a percentage
   */
  toPercent(input?: any): t.Percent {
    const clamp = (value: number) => Math.max(0, Math.min(1, value));
    if (typeof input === 'number') return clamp(input);
    if (typeof input === 'string') {
      const text = input.trim();
      if (!text) return 0;
      if (text.endsWith('%')) {
        const num = Number(text.replace(/%$/, ''));
        return isNaN(num) ? 0 : clamp(num / 100);
      } else {
        const num = Number(text);
        return isNaN(num) ? 0 : clamp(num);
      }
    }
    return 0;
  },
} as const;

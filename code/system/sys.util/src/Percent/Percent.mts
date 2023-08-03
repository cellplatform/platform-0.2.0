import { type t } from '../common';

/**
 * Tools for working with numbers that represent percentages.
 */
export const Percent = {
  /**
   * Converts a value to a percentage.
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

  /**
   * Determine if the number represents a percentage (0..1).
   */
  isPercent(value?: t.PixelOrPercent): value is number {
    if (typeof value !== 'number') return false;
    return value >= 0 && value <= 1;
  },

  /**
   * Determine if the number represents pixels (> 1).
   */
  isPixels(value?: t.PixelOrPercent): value is number {
    if (typeof value !== 'number') return false;
    return value > 1;
  },
} as const;

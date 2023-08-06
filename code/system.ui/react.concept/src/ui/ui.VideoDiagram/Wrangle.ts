import { type t } from './common';

/**
 * Helpers
 */
export const Wrangle = {
  imageAtTime(timestamps: t.SlugImage[] = [], current?: t.Seconds): t.SlugImage | undefined {
    if (timestamps.length === 0 || typeof current !== 'number') return;
    return timestamps.find((item, i) => {
      const { start = -1, end } = item;
      if (current < start) return false;

      const next = timestamps[i + 1];
      if (next && current >= (next.start ?? -1)) return false; // NB: Next item superseedes.

      if (typeof end === 'number' && current > end) return;
      return true;
    });
  },
} as const;

import type * as t from './types.mjs';

/**
 * Helpers
 */
export const Size = {
  isPercent(value?: t.PixelOrPercent): value is number {
    if (typeof value !== 'number') return false;
    return value >= 0 && value <= 1;
  },
  isPixels(value?: t.PixelOrPercent): value is number {
    if (typeof value !== 'number') return false;
    return value > 1;
  },

  fromPixelOrPercent(value?: t.PixelOrPercent, parent?: t.Pixels, min?: t.Pixels) {
    const done = (result: number) => {
      if (typeof min === 'number' && result < min) return min;
      return result;
    };
    if (value === undefined || parent === undefined || parent < 0) return -1;
    if (Size.isPercent(value)) return done(parent * value);
    if (Size.isPixels(value)) return done(value);
    return -1;
  },
} as const;

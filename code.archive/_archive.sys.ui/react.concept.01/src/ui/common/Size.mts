import { Percent, type t } from '../../common';

/**
 * Helpers
 */
export const Size = {
  rectToSize(rect: t.DomRect): t.Size {
    const { width, height } = rect;
    return { width, height };
  },

  fromPixelOrPercent(value?: t.PixelOrPercent, parent?: t.Pixels, min?: t.Pixels) {
    const done = (value: number) => {
      const isMin = typeof min === 'number' && value < min;
      return isMin ? min : value;
    };
    if (value === undefined || parent === undefined || parent < 0) return -1;
    if (Percent.isPercent(value)) return done(parent * value);
    if (Percent.isPixels(value)) return done(value);
    return -1;
  },
} as const;

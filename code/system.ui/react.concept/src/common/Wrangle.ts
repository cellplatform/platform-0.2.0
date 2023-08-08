import { Percent } from './libs.mjs';
import type * as t from './types.mjs';

/**
 * Helpers
 */
export const Wrangle = {
  ticks(slug?: t.SlugVideo, status?: t.VideoStatus): Partial<t.SliderTickProps> {
    if (!slug?.timestamps || !status || status.secs.total <= 0) return {};
    const total = status.secs.total;
    const items = slug.timestamps
      .map((item) => item.start ?? 0)
      .map((start) => Percent.clamp(start / total))
      .filter((percent) => percent > 0);
    return { items };
  },
} as const;

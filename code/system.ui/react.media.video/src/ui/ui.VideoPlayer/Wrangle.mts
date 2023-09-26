import { type t, AspectRatio, DEFAULTS } from './common';

type Seconds = number;

export const Wrangle = {
  /**
   * Video definition object formatting.
   */
  toYouTube: (id: string): t.VideoSrc => Wrangle.toDef('YouTube', id),
  toVimeo: (id: string | number): t.VideoSrc => Wrangle.toDef('Vimeo', id),
  toDef(kind: t.VideoKind, id: string | number) {
    return { kind, ref: id.toString() } as t.VideoSrc;
  },

  clampPercent(value: t.Percent) {
    return Math.max(0, Math.min(1, value));
  },

  /**
   * Play status.
   */
  toStatus(args: {
    total: Seconds;
    current: Seconds;
    buffered: Seconds;
    playing?: boolean;
    loop?: boolean;
    buffering?: boolean;
    muted?: boolean;
  }): t.VideoStatus {
    const {
      total,
      current,
      buffered,
      buffering = false,
      playing = false,
      loop = false,
      muted = false,
    } = args;
    const percent = {
      complete: total === 0 ? 0 : Wrangle.clampPercent(current / total),
      buffered: total === 0 ? 0 : Wrangle.clampPercent(buffered / total),
    };
    const complete = percent.complete === 1;
    return {
      percent,
      secs: { total, current, buffered },
      is: {
        complete,
        playing: complete ? loop : playing, // NB: Always playing if looping.
        buffering,
        muted,
      },
    };
  },

  /**
   * Derive [width/height] from aspect ratio.
   */
  dimensions(aspectRatio: string, width?: t.Pixels, height?: t.Pixels) {
    // NB: Only one dimension is required to derive from the aspect ratio.
    if (typeof width === 'number' && typeof height === 'number') height = undefined;
    if (width === undefined && height === undefined) width = DEFAULTS.width;

    if (typeof width === 'number') {
      const height = AspectRatio.height(aspectRatio, width);
      return { width, height };
    }

    if (typeof height === 'number') {
      const width = AspectRatio.width(aspectRatio, height);
      return { width, height };
    }

    throw new Error('Failed to derive dimensions from aspect ratio.');
  },
};

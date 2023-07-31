import { type t } from './common';

type Seconds = number;

export const Wrangle = {
  /**
   * Video definition object formatting.
   */
  toYouTube: (id: string): t.VideoSrc => Wrangle.toDef('YouTube', id),
  toVimeo: (id: string | number): t.VideoSrc => Wrangle.toDef('Vimeo', id),
  toDef(kind: t.VideoKind, id: string | number) {
    return { kind, id: id.toString() } as t.VideoSrc;
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
  }): t.VideoStatus {
    const { total, current, buffered, buffering = false, playing = false, loop = false } = args;
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
      },
    };
  },
};

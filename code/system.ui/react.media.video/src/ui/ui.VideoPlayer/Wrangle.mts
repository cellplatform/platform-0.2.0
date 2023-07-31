import { type t } from './common';

type Seconds = number;

export const Wrangle = {
  /**
   * Video definition object formatting.
   */
  toYouTube: (id: string): t.VideoDef => Wrangle.toDef('YouTube', id),
  toVimeo: (id: string | number): t.VideoDef => Wrangle.toDef('Vimeo', id),
  toDef(kind: t.VideoKind, id: string | number) {
    return { kind, id: id.toString() } as t.VideoDef;
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
    const {
      total: totalTime,
      current: currentTime,
      buffered,
      buffering = false,
      playing = false,
      loop = false,
    } = args;
    const percent = totalTime === 0 ? 0 : Math.max(0, Math.min(1, currentTime / totalTime));
    const complete = percent === 1;
    return {
      percent,
      secs: { total: totalTime, current: currentTime, buffered },
      is: {
        playing: complete ? loop : playing, // NB: Always playing if looping.
        complete,
        buffering,
      },
    };
  },
};

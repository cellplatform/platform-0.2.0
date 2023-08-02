import { type t, DEFAULTS } from './common';

/**
 * Helpers
 */
export const Wrangle = {
  settings(props: { track?: t.SliderTrackProps; thumb?: t.SliderThumbProps }) {
    const track: Required<t.SliderTrackProps> = {
      height: props.track?.height ?? DEFAULTS.track.height,
    };
    const thumb: Required<t.SliderThumbProps> = {
      size: props.thumb?.size ?? DEFAULTS.thumb.size,
      color: props.thumb?.color ?? DEFAULTS.thumb.color,
    };
    return { track, thumb } as const;
  },

  percent(value?: number) {
    return Math.max(0, Math.min(1, value ?? 0));
  },

  elementToPercent(el: HTMLDivElement, clientX: number) {
    const totalWidth = el.offsetWidth;
    const position = clientX - el.getBoundingClientRect().left;
    return totalWidth <= 0 ? 0 : Wrangle.percent(position / totalWidth);
  },
} as const;

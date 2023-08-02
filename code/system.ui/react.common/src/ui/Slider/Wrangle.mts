import { type t, DEFAULTS } from './common';

/**
 * Helpers
 */
export const Wrangle = {
  props(props: t.SliderProps) {
    const track = Wrangle.track(props.track);
    const thumb = Wrangle.thumb(props.thumb);
    return { track, thumb } as const;
  },

  track(props?: Partial<t.SliderTrackProps>): t.SliderTrackProps {
    const DEFAULT = DEFAULTS.track;
    return {
      height: props?.height ?? DEFAULT.height,
      defaultColor: props?.defaultColor ?? DEFAULT.defaultColor,
      progressColor: props?.progressColor ?? DEFAULT.progressColor,
      borderColor: props?.borderColor ?? DEFAULT.borderColor,
    };
  },

  thumb(props?: Partial<t.SliderThumbProps>): t.SliderThumbProps {
    const DEFAULT = DEFAULTS.thumb;
    return {
      size: props?.size ?? DEFAULT.size,
      color: props?.color ?? DEFAULT.color,
      pressedScale: props?.pressedScale ?? DEFAULT.pressedScale,
    };
  },

  percent(value?: number) {
    return Math.max(0, Math.min(1, value ?? 0));
  },

  elementToPercent(el: HTMLDivElement, clientX: number) {
    const totalWidth = el.offsetWidth;
    const position = clientX - el.getBoundingClientRect().left;
    return totalWidth <= 0 ? 0 : Wrangle.percent(position / totalWidth);
  },

  thumbLeft(percent: t.Percent, totalWidth: t.Pixels, thumbSize: t.Pixels) {
    return (totalWidth - thumbSize) * percent;
  },
} as const;

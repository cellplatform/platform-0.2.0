import { css, Color, COLORS, type t, DEFAULTS } from './common';

/**
 * Helpers
 */
export const Wrangle = {
  props(props: t.SliderProps) {
    const track = Wrangle.track(props.track);
    const thumb = Wrangle.thumb(props.thumb);
    const ticks = Wrangle.ticks(props.ticks);
    return { track, thumb, ticks } as const;
  },

  track(props?: Partial<t.SliderTrackProps>): t.SliderTrackProps {
    const DEFAULT = DEFAULTS.track;
    return {
      height: props?.height ?? DEFAULT.height,
      defaultColor: props?.defaultColor ?? DEFAULT.defaultColor,
      highlighColor: props?.highlighColor ?? DEFAULT.highlighColor,
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

  ticks(props?: Partial<t.SliderTickProps>): t.SliderTickProps {
    const DEFAULT = DEFAULTS.ticks;
    return {
      offset: props?.offset ?? DEFAULT.offset,
      items: props?.items ?? DEFAULT.items,
    };
  },

  tickItems(input?: t.SliderTickInput[]): t.SliderTick[] {
    if (!Array.isArray(input)) return [];
    return input
      .filter((item) => typeof item === 'number' || typeof item === 'object')
      .map((value) => {
        return typeof value === 'number' ? { value } : (value as t.SliderTick);
      });
  },

  percent(value?: number) {
    return Math.max(0, Math.min(1, value ?? 0));
  },

  elementToPercent(el: HTMLDivElement, clientX: number) {
    const totalWidth = el.offsetWidth;
    const position = clientX - el.getBoundingClientRect().left;
    const res = totalWidth <= 0 ? 0 : Wrangle.percent(position / totalWidth);
    return Number(res.toFixed(3));
  },

  thumbLeft(percent: t.Percent, totalWidth: t.Pixels, thumbSize: t.Pixels) {
    return (totalWidth - thumbSize) * percent;
  },
} as const;

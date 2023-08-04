import { Color, COLORS, type t } from './common';

export * from '../common';
export { useRedraw } from '../use';

/**
 * Constants
 */
export const DEFAULTS = {
  enabled: true,
  percent: 0,

  get thumb(): t.SliderThumbProps {
    return {
      size: 20,
      color: COLORS.WHITE,
      pressedScale: 1.1,
    };
  },
  get track(): t.SliderTrackProps {
    return {
      height: 20,
      borderColor: Color.alpha(COLORS.DARK, 0.06),
      defaultColor: Color.alpha(COLORS.DARK, 0.06),
      highlightColor: COLORS.BLUE,
    };
  },
  get ticks(): t.SliderTickProps {
    return {
      offset: { top: 5, bottom: 5 },
      items: [],
    };
  },
} as const;

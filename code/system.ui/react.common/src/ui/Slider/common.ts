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
      pressedScale: 1.1,
      color: {
        default: COLORS.WHITE,
        border: Color.alpha(COLORS.DARK, 0.2),
      },
    };
  },
  get track(): t.SliderTrackProps {
    return {
      height: 20,
      color: {
        default: Color.alpha(COLORS.DARK, 0.06),
        highlight: COLORS.BLUE,
        border: Color.alpha(COLORS.DARK, 0.06),
      },
    };
  },
  get ticks(): t.SliderTickProps {
    return {
      offset: { top: 5, bottom: 5 },
      items: [],
    };
  },
} as const;

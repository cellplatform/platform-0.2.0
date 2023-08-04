import { Color, COLORS, type t } from './common';

export * from '../common';
export { useRedraw } from '../use';

/**
 * Constants
 */
export const DEFAULTS = {
  enabled: true,
  percent: 0,

  get track(): t.SliderTrackProps {
    return {
      percent: undefined,
      height: 20,
      color: {
        default: Color.alpha(COLORS.DARK, 0.06),
        border: Color.alpha(COLORS.DARK, 0.06),
        highlight: COLORS.BLUE,
      },
    };
  },

  get thumb(): t.SliderThumbProps {
    return {
      size: 20,
      pressedScale: 1.1,
      opacity: 1,
      color: {
        default: COLORS.WHITE,
        border: Color.alpha(COLORS.DARK, 0.2),
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

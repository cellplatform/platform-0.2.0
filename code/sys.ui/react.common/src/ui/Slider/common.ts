import { COLORS, Color, Pkg, type t } from './common';

export { useRedraw } from '../../ui.use';
export * from '../common';

type Mutate<T> = (draft: T) => void;

/**
 * Constants
 */
export const DEFAULTS = {
  displayName: `${Pkg.name}:Slider`,
  enabled: true,
  percent: 0,

  track(edit?: Mutate<t.SliderTrackProps>) {
    const obj: t.SliderTrackProps = {
      percent: undefined,
      height: 20,
      color: {
        default: Color.alpha(COLORS.DARK, 0.06),
        border: Color.alpha(COLORS.DARK, 0.06),
        highlight: COLORS.BLUE,
      },
    };
    edit?.(obj);
    return obj;
  },

  thumb(edit?: Mutate<t.SliderThumbProps>) {
    const obj: t.SliderThumbProps = {
      size: 20,
      pressedScale: 1.1,
      opacity: 1,
      color: {
        default: COLORS.WHITE,
        border: Color.alpha(COLORS.DARK, 0.2),
      },
    };
    edit?.(obj);
    return obj;
  },

  ticks(edit?: Mutate<t.SliderTickProps>) {
    const obj: t.SliderTickProps = {
      offset: { top: 5, bottom: 5 },
      items: [],
    };
    edit?.(obj);
    return obj;
  },
} as const;

import { DEFAULTS, Percent, type t } from './common';

/**
 * Helpers
 */
export const Wrangle = {
  gridCss(props: t.SplitHorizonProps) {
    const { ratio = DEFAULTS.ratio } = props;
    const percent = Percent.toPercent(ratio);
    const top = 1 * percent;
    const bottom = 1 - top;
    return {
      display: 'grid',
      gridTemplateRows: `${top}fr ${bottom}fr`,
    };
  },
} as const;

import { DEFAULTS, Percent, type t } from './common';

/**
 * Helpers
 */
export const Wrangle = {
  gridCss(props: t.SplitHorizonProps) {
    const { split = DEFAULTS.split } = props;
    const percent = Percent.toPercent(split);
    const top = 1 * percent;
    const bottom = 1 - top;
    return {
      display: 'grid',
      gridTemplateRows: `${top}fr ${bottom}fr`,
    };
  },
} as const;

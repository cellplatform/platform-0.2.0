import { DEFAULTS, Percent, type t } from './common';

/**
 * Helpers
 */
export const Wrangle = {
  gridCss(props: t.SplitLayoutProps) {
    const percent = Percent.clamp(props.percent ?? DEFAULTS.percent);
    const top = 1 * percent;
    const bottom = 1 - top;
    return {
      display: 'grid',
      gridTemplateRows: `${top}fr ${bottom}fr`,
    } as const;
  },
} as const;

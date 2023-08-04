import { DEFAULTS, Percent, type t } from './common';

/**
 * Helpers
 */
export const Wrangle = {
  percent(value?: t.Percent, min?: t.Percent, max?: t.Percent) {
    return Percent.clamp(value ?? DEFAULTS.split, min, max);
  },

  gridCss(props: t.SplitLayoutProps): React.CSSProperties {
    const { axis = DEFAULTS.axis } = props;
    const percent = Wrangle.percent(props.split, props.splitMin, props.splitMax);
    const near = 1 * percent;
    const far = 1 - near;
    const template = `${near.toFixed(3)}fr ${far.toFixed(3)}fr`;
    return {
      display: 'grid',
      gridTemplateRows: axis === 'x' ? template : undefined,
      gridTemplateColumns: axis === 'y' ? template : undefined,
    } as const;
  },
} as const;

import { DEFAULTS, Percent, type t } from './common';

/**
 * Helpers
 */
export const Wrangle = {
  percent(props: { split?: t.Percent; min?: t.Percent; max?: t.Percent }) {
    const { split = DEFAULTS.split } = props;
    return Percent.clamp(split, props.min, props.max);
  },

  gridCss(props: t.SplitLayoutProps): React.CSSProperties {
    const { axis = DEFAULTS.axis } = props;
    const percent = Wrangle.percent(props);
    const near = 1 * percent;
    const far = 1 - near;
    const template = `${near}fr ${far}fr`;
    return {
      display: 'grid',
      gridTemplateRows: axis === 'x' ? template : undefined,
      gridTemplateColumns: axis === 'y' ? template : undefined,
    } as const;
  },
} as const;

import { DEFAULTS, Percent, type t } from './common';

/**
 * Helpers
 */
export const Wrangle = {
  gridCss(props: t.SplitLayoutProps): React.CSSProperties {
    const { axis = DEFAULTS.axis } = props;
    const percent = Percent.clamp(props.split ?? DEFAULTS.percent);
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

import { DEFAULTS, Percent, type t } from './common';

/**
 * Helpers
 */
export const Wrangle = {
  children(props: t.SplitLayoutProps) {
    return Array.isArray(props.children) ? props.children : [];
  },

  percent(value?: t.Percent, min?: t.Percent, max?: t.Percent) {
    return Percent.clamp(value ?? DEFAULTS.split, min, max);
  },

  gridCss(props: t.SplitLayoutProps): React.CSSProperties {
    const { axis = DEFAULTS.axis } = props;
    const ratio = Wrangle.percent(props.split, props.splitMin, props.splitMax);

    function calc(ratio: number): string {
      const first = (ratio * 100).toFixed(2) + '%';
      const last = (100 - ratio * 100).toFixed(2) + '%';
      return `${first} ${last}`;
    }

    const template = calc(ratio);
    return {
      display: 'grid',
      gridTemplateRows: axis === 'x' ? template : undefined,
      gridTemplateColumns: axis === 'y' ? template : undefined,
    } as const;
  },
} as const;

import { Color, css, type t } from './common';

export type PageProps = {
  index: t.Index;
  theme: t.ColorTheme;
  transition: t.Msecs;
  opacity?: t.Percent;
  style?: t.CssValue;
};

export const Page: React.FC<PageProps> = (props) => {
  const { theme } = props;
  const height = wrangle.height(props);
  const edgeOffset = wrangle.edgeOffset(props);
  const radius = wrangle.radius(props);

  /**
   * Render
   */
  const t = (prop: string, time: t.Msecs = props.transition) => `${prop} ${time}ms`;
  const transition = [t('opacity'), t('height'), t('left'), t('right')].join(', ');
  const styles = {
    base: css({
      height,
      Absolute: [null, edgeOffset, 0, edgeOffset],
      transition,
      opacity: props.opacity ?? 1,
      display: 'grid',
    }),
    inner: css({
      backgroundColor: Color.alpha(theme.bg, 0.9),
      opacity: wrangle.opacity(props),
      transition,
      border: `solid 1px ${Color.alpha(theme.fg, 0.7)}`,
      borderBottom: 'none',
      borderTopLeftRadius: radius,
      borderTopRightRadius: radius,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.inner} />
    </div>
  );
};

/**
 * Helpers
 */
const wrangle = {
  height(props: PageProps) {
    const { index } = props;
    const growthFactor = 18;
    return growthFactor * Math.log1p(index);
  },
  edgeOffset(props: PageProps) {
    return props.index * 8;
  },
  radius(props: PageProps) {
    return wrangle.decay(props.index, 5, 2, 0.85);
  },
  opacity(props: PageProps) {
    return wrangle.decay(props.index, 1, 0.3, 0.85);
  },
  decay(index: t.Index, max: number, min: number, decay: t.Percent) {
    return Math.max(min, max * Math.pow(decay, index));
  },
} as const;

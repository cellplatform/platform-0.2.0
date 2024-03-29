import { COLORS, css, type t } from './common';

export type TickProps = {
  tick: t.SliderTick;
  style?: t.CssValue;
};

export const Tick: React.FC<TickProps> = (props) => {
  const { tick } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      Absolute: [0, -5, 0, -5],
      display: 'grid',
      justifyContent: 'center',
    }),
    inner: css({
      backgroundColor: COLORS.DARK,
      opacity: 0.15,
      width: 1,
    }),
  };

  return (
    <div {...css(styles.base, props.style)} title={tick.label}>
      <div {...styles.inner} />
    </div>
  );
};

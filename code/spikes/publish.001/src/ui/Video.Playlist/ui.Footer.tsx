import { Value, COLORS, css, t, Time } from '../common';

type Milliseconds = number;

export type FooterProps = {
  totalDuration?: Milliseconds;
  style?: t.CssValue;
};

export const Footer: React.FC<FooterProps> = (props) => {
  const bottomRight = Wrangle.duration(props);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      minHeight: 60,
      display: 'grid',
      gridTemplateRows: '1fr auto',
    }),
    bottom: css({
      display: 'grid',
      gridTemplateColumns: `1fr auto`,
    }),
    bottomLeft: css({
      borderBottom: `solid 5px ${COLORS.CYAN}`,
    }),
    bottomRight: css({
      PaddingX: 35,
      fontSize: 22,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div></div>
      <div {...styles.bottom}>
        <div {...styles.bottomLeft} />
        {bottomRight && <div {...styles.bottomRight}>{bottomRight}</div>}
      </div>
    </div>
  );
};

/**
 * Helpers
 */
const Wrangle = {
  duration(props: FooterProps) {
    const duration = props.totalDuration ? Time.duration(props.totalDuration) : undefined;
    if (!duration) return '';

    const mins = Value.round(duration.min, 0);
    return `${mins} ${Value.plural(mins, 'min', 'mins')} (total)`;
  },
};

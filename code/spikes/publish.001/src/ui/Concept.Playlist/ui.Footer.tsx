import { Value, COLORS, css, t, Time } from '../common';

type Seconds = number;

export type FooterProps = {
  totalSecs?: Seconds;
  style?: t.CssValue;
};

export const Footer: React.FC<FooterProps> = (props) => {
  const duration = Wrangle.duration(props);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      minHeight: 60,
      display: 'grid',
      gridTemplateRows: '1fr auto',
      userSelect: 'none',
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
    }),
    duration: css({
      position: 'relative',
      bottom: -5,
      fontSize: 22,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div></div>
      <div {...styles.bottom}>
        <div {...styles.bottomLeft} />
        {
          <div {...styles.bottomRight}>
            <div {...styles.duration}>{duration ? duration.toString() : '(empty)'}</div>
          </div>
        }
      </div>
    </div>
  );
};

/**
 * Helpers
 */
const Wrangle = {
  duration(props: FooterProps) {
    const duration = props.totalSecs ? Time.duration(props.totalSecs * 1000) : undefined;
    return {
      toString() {
        const minutes = Value.round(duration?.min ?? 0, 0);
        return minutes < 1
          ? `(under a minute)`
          : `${minutes} ${Value.plural(minutes, 'min', 'mins')} (total)`;
      },
    };
  },
};

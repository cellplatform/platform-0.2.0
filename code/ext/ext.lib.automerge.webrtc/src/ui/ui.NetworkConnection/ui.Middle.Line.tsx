import { COLORS, Color, css, type t } from './common';

export type LineProps = {
  isConnected: boolean;
  isTransmitting: boolean;
  style?: t.CssValue;
};

export const Line: React.FC<LineProps> = (props) => {
  const { isConnected, isTransmitting } = props;

  /**
   * Render
   */
  const COLOR = isTransmitting ? COLORS.MAGENTA : COLORS.DARK;
  const SECS = 0.5;
  const styles = {
    base: css({
      position: 'relative',
      height: 15,
      display: 'grid',
      alignContent: 'center',
    }),
    borderEdges: css({
      Absolute: 0,
      borderLeft: `solid 1px ${Color.alpha(COLOR, 0.1)}`,
      borderRight: `solid 1px ${Color.alpha(COLOR, 0.1)}`,
      transition: `opacity ${SECS}s`,
      opacity: isConnected ? 0.8 : 0,
      pointerEvents: 'none',
    }),
    line: css({
      stroke: Color.alpha(COLOR, 0.3),
      strokeWidth: 3,
      strokeDasharray: '8,3',
      opacity: isConnected ? 1 : 0,
      transition: `opacity ${SECS}s, border-color ${SECS}s`,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.borderEdges} />
      <svg width={'100%'} height={3}>
        <line x1={0} y1={1.5} x2={'100%'} y2={1.5} {...styles.line} />
      </svg>
    </div>
  );
};

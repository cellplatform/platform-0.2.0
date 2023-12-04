import { COLORS, Color, css, type t } from './common';
import { Line } from './ui.Middle.Line';

export type MiddleProps = {
  isConnected: boolean;
  isTransmitting: boolean;
  style?: t.CssValue;
};

export const Middle: React.FC<MiddleProps> = (props) => {
  const { isConnected, isTransmitting } = props;

  /**
   * Render
   */
  const COLOR = isTransmitting ? COLORS.MAGENTA : COLORS.DARK;
  const SECS = 0.5;
  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
      alignContent: 'center',
      MarginX: 8,
    }),
    labelOuter: css({
      Absolute: [10, 0, null, 0],
      display: 'grid',
      placeItems: 'center',
      opacity: isConnected ? 1 : 0,
      transition: `opacity ${SECS}s, border-color ${SECS}s`,
      userSelect: 'none',
    }),
    labelText: css({
      fontSize: 9,
      fontFamily: 'monospace',
      letterSpacing: -0.1,
      width: 60,
      textAlign: 'center',
      overflow: 'hidden',
      color: Color.alpha(COLOR, isTransmitting ? 0.65 : 0.3),
      transition: `border-color ${SECS}s, color ${SECS}s`,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.labelOuter}>
        <div {...styles.labelText}>{'WebRTC/data'}</div>
      </div>
      <Line isConnected={isConnected} isTransmitting={isTransmitting} />
    </div>
  );
};

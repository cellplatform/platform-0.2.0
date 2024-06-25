import { COLORS, Color, DEFAULTS, css, useSizeObserver, type t } from './common';
import { Line } from './ui.Middle.Line';

export type MiddleProps = {
  isConnected: boolean;
  isTransmitting: boolean;
  label?: string;
  style?: t.CssValue;
};

export const Middle: React.FC<MiddleProps> = (props) => {
  const { isConnected, isTransmitting, label = DEFAULTS.connectionLabel } = props;
  const size = useSizeObserver();

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

  const elLabel = size.rect.width > 130 && (
    <div {...styles.labelOuter}>
      <div {...styles.labelText}>{label}</div>
    </div>
  );

  const elBody = size.ready && (
    <>
      {elLabel}
      <Line isConnected={isConnected} isTransmitting={isTransmitting} />
    </>
  );

  return (
    <div ref={size.ref} {...css(styles.base, props.style)}>
      {elBody}
    </div>
  );
};

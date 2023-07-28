import { COLORS, Color, css, type t } from '../common';

export type OverlayMessageProps = {
  content?: string | JSX.Element;
  style?: t.CssValue;
};

export const OverlayMessage: React.FC<OverlayMessageProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      boxShadow: `0 0px 90px 0 ${Color.alpha(COLORS.DARK, 0.5)}`,
      backgroundColor: Color.alpha(COLORS.WHITE, 0.65),
      border: `solid 1px ${Color.alpha(COLORS.WHITE, 0.2)}`,
      backdropFilter: 'blur(10px)',
      borderRadius: 8,
      boxSizing: 'border-box',
      Padding: [20, 30],
      userSelect: 'none',
      minWidth: 190,
      minHeight: 60,
      maxWidth: 290,
      display: 'grid',
      placeItems: 'center',
    }),
    label: css({ fontSize: 16 }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.label}>{props.content}</div>
    </div>
  );
};

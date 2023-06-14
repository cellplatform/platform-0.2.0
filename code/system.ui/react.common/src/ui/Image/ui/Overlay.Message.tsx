import { COLORS, Color, css, type t } from '../common';

export type OverlayMessageProps = {
  content: string | JSX.Element;
  style?: t.CssValue;
};

export const OverlayMessage: React.FC<OverlayMessageProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      backgroundColor: Color.alpha(COLORS.WHITE, 0.5),
      backdropFilter: 'blur(10px)',
      borderRadius: 8,
      boxSizing: 'border-box',
      userSelect: 'none',
      minWidth: 190,
      minHeight: 60,
      display: 'grid',
      placeItems: 'center',
    }),
    label: css({
      fontSize: 16,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.label}>{props.content}</div>
    </div>
  );
};

import { COLORS, Color, css, type t } from '../common';
import { OverlayMessage } from './Overlay.Message';

export type OverlayProps = {
  message?: string | JSX.Element;
  blur?: number;
  focusBorder?: boolean;
  style?: t.CssValue;
};

export const Overlay: React.FC<OverlayProps> = (props) => {
  const { focusBorder = true, blur = 0 } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      pointerEvents: 'none',
      Absolute: 0,
      display: 'grid',
      placeItems: 'center',
      backdropFilter: `blur(${blur}px)`,
      color: COLORS.DARK,
    }),

    border: {
      base: css({
        border: 'dashed 3px',
        borderRadius: 30,
      }),
      background: css({
        Absolute: 15,
        borderColor: Color.alpha(COLORS.WHITE, 0.5),
      }),
      foreground: css({
        Absolute: -1.5,
        borderColor: Color.alpha(COLORS.DARK, 0.1),
      }),
    },
  };

  const elBorder = focusBorder && (
    <div {...css(styles.border.base, styles.border.background)}>
      <div {...css(styles.border.base, styles.border.foreground)} />
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      <OverlayMessage content={props.message} />
      {elBorder}
    </div>
  );
};

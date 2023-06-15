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
      backgroundColor: Color.alpha(COLORS.DARK, 0.1),
      color: COLORS.DARK,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <OverlayMessage content={props.message} />
    </div>
  );
};

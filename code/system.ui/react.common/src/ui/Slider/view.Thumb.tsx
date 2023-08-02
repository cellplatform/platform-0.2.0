import { Color, COLORS, css, type t } from './common';
import { Wrangle } from './Wrangle.mjs';

export type ThumbProps = {
  enabled: boolean;
  pressed?: boolean;
  percent: t.Percent;
  totalWidth: t.Pixels;
  thumb: t.SliderThumbProps;
  height: t.Pixels;
  style?: t.CssValue;
};

export const Thumb: React.FC<ThumbProps> = (props) => {
  const { enabled, thumb, percent, totalWidth } = props;
  const left = Wrangle.thumbLeft(percent, totalWidth, thumb.size);
  const pressed = enabled && props.pressed;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      Absolute: [null, null, null, left],
      width: thumb.size,
      height: props.height,
      pointerEvents: 'none',
      transform: `scale(${pressed ? thumb.pressedScale : 1})`,
      display: 'grid',
      placeItems: 'center',
    }),
    body: css({
      Size: thumb.size,
      overflow: 'hidden',
      borderRadius: thumb.size / 2,
      backgroundColor: thumb.color,
      border: `solid 1px ${Color.alpha(COLORS.DARK, 0.2)}`,
      boxSizing: 'border-box',
      boxShadow: `0 1px 5px 0 ${Color.format(-0.1)}`,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body} />
    </div>
  );
};

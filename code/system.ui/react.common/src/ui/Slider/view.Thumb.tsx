import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t, useMouseState } from './common';

export type ThumbProps = {
  enabled: boolean;
  percent: t.Percent;
  totalWidth: t.Pixels;
  thumb: Required<t.SliderThumbProps>;
  style?: t.CssValue;
};

export const Thumb: React.FC<ThumbProps> = (props) => {
  const { enabled, thumb, percent, totalWidth } = props;
  const Size = thumb.size;

  const subWidth = totalWidth - Size;
  const left = subWidth * percent; //- Size / 2;

  const mouse = useMouseState();

  /**
   * [Render]
   */
  const borderRadius = Size / 2;
  const styles = {
    base: css({
      Absolute: [null, null, null, left],
      Size,
      overflow: 'hidden',
      borderRadius,
      backgroundColor: thumb.color,
      border: `solid 1px ${Color.alpha(COLORS.DARK, 0.2)}`,
      boxSizing: 'border-box',
      boxShadow: `0 1px 5px 0 ${Color.format(-0.1)}`,
      pointerEvents: 'none',
    }),
    clicked: css({
      Absolute: 0,
      borderRadius,
      backgroundColor: Color.alpha(COLORS.DARK, 0.03),
      opacity: enabled && mouse.isDown ? 1 : 0,
    }),
  };

  return (
    <div {...css(styles.base, props.style)} {...mouse.handlers}>
      <div {...styles.clicked} />
    </div>
  );
};

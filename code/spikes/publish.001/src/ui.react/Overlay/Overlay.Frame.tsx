import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, FC } from '../common';

export type OverlayFrameProps = {
  style?: t.CssValue;
};

export const OverlayFrame: React.FC<OverlayFrameProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      Absolute: '',
      // backgroundColor: Color.alpha(COLORS.DARK, 0.55),
      backgroundColor: Color.format(0.8),
      backdropFilter: `blur(40px)`,
    }),
    body: css({
      // Absolute: [80, 30],
      Absolute: 30,
      backgroundColor: COLORS.WHITE,
      borderRadius: 8,
      boxSizing: 'border-box',
      padding: 30,
      boxShadow: `0 0 60px 0 ${Color.format(-0.1)}`,
      border: `solid 1px ${Color.alpha(COLORS.DARK, 0.3)}`,
      '@media (max-width: 1100px)': { opacity: 0, pointerEvents: 'none' },
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body}>
        <div>{'Overlay'}</div>
      </div>
    </div>
  );
};

import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, FC } from '../common';

export type HarnessHostProps = {
  children?: JSX.Element;
  style?: t.CssValue;
};

export const HarnessHost: React.FC<HarnessHostProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      flex: 1,
      backgroundColor: Color.alpha(COLORS.DARK, 0.02),
      padding: 20, // TEMP 🐷
    }),
  };
  return (
    <div {...css(styles.base, props.style)}>
      <div>Host 🐷</div>
      <div>{props.children}</div>
    </div>
  );
};

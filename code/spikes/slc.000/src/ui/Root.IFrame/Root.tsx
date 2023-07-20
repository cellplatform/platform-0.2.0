import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from './common';

export type HomeIFrameProps = {
  style?: t.CssValue;
};

export const Root: React.FC<HomeIFrameProps> = (props) => {
  const url = 'https://slc-1dot1ggiz.vercel.app/';

  /**
   * [Render]
   */
  const styles = {
    base: css({
      Absolute: 0,
      backgroundColor: COLORS.DARK,
    }),
    iframe: css({
      Absolute: 0,
      width: '100%',
      height: '100%',
      border: 'none',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <iframe src={url} {...styles.iframe} />
    </div>
  );
};

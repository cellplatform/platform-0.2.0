import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, FC } from '../common';

export type ZoomAndPanProps = {
  style?: t.CssValue;
};

export const ZoomAndPan: React.FC<ZoomAndPanProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
  };
  return (
    <div {...css(styles.base, props.style)}>
      <div>ZoomAndPan 🐷</div>
    </div>
  );
};

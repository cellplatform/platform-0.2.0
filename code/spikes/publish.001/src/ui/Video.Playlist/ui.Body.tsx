import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx } from '../common';

export type BodyProps = {
  style?: t.CssValue;
};

export const Body: React.FC<BodyProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      minHeight: 50,
    }),
  };
  return (
    <div {...css(styles.base, props.style)}>
      <div>{`Body 🐷`}</div>
    </div>
  );
};

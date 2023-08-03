import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, FC, rx, type t } from '../common';

export type TooSmallProps = {
  style?: t.CssValue;
};

export const TooSmall: React.FC<TooSmallProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      display: 'grid',
      placeItems: 'center',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div>{`🐷 TooSmall`}</div>
    </div>
  );
};

import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, rx, FC, type t } from '../common';

export type ConnectProps = {
  style?: t.CssValue;
};

export const Connect: React.FC<ConnectProps> = (props) => {
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
      <div>{`🐷 Connect`}</div>
    </div>
  );
};

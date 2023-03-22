import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx } from '../common';

export type CrdtHistoryProps = {
  style?: t.CssValue;
};

export const CrdtHistory: React.FC<CrdtHistoryProps> = (props) => {
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
      <div>{`🐷 CrdtHistory`}</div>
    </div>
  );
};

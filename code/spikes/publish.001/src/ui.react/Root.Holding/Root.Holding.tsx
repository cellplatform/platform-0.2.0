import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, FC } from '../common.mjs';

export type RootHoldingProps = {
  style?: t.CssValue;
};

export const RootHolding: React.FC<RootHoldingProps> = (props) => {
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
      <div>RootHolding 🐷</div>
    </div>
  );
};

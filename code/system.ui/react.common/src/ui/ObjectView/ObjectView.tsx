import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx } from '../common';

export type ObjectViewProps = {
  name?: string;
  data?: any;
  expand?: number | { level?: number; paths?: string[] };
  style?: t.CssValue;
};

export const ObjectView: React.FC<ObjectViewProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      userSelect: 'auto',
    }),
  };
  return (
    <div {...css(styles.base, props.style)}>
      <div>{`ObjectView 🐷`}</div>
    </div>
  );
};

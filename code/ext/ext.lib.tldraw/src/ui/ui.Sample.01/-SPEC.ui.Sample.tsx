import { useEffect, useRef, useState } from 'react';
import { Tldraw } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';

import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from './common';

export type SampleProps = {
  style?: t.CssValue;
};

export const Sample: React.FC<SampleProps> = (props) => {
  /**
   * Render
   */
  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
      placeItems: 'center',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <Tldraw />
    </div>
  );
};

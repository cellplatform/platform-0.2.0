import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, FC, rx, type t } from './common';

export type SampleProps = {
  style?: t.CssValue;
};

export const Sample: React.FC<SampleProps> = (props) => {
  /**
   * Render
   */
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div>{`🐷 Sample`}</div>
    </div>
  );
};

import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t, Icons } from './common';

export type MediaButtonProps = {
  style?: t.CssValue;
};

export const MediaButton: React.FC<MediaButtonProps> = (props) => {
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
      <div>{`🐷 MediaButton`}</div>
    </div>
  );
};

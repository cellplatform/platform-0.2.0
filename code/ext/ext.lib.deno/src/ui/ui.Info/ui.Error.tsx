import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t, Icons } from './common';

export type ErrorProps = {
  error?: t.InfoError;
  style?: t.CssValue;
};

export const Error: React.FC<ErrorProps> = (props) => {
  /**
   * Render
   */
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      display: 'grid',
      gridTemplateColumns: 'auto auto',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div>{`🐷 Error`}</div>
      <Icons.Error />
    </div>
  );
};

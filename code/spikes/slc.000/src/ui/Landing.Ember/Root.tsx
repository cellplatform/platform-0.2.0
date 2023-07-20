import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, FC, rx, type t, Style } from '../common';

export type RootProps = {
  style?: t.CssValue;
};

export const Root: React.FC<RootProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      Absolute: 0,
      padding: 20,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div>{`🐷 Social Lean Canvas → (Ember)`}</div>
    </div>
  );
};

import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx } from '../common';
import { Pkg } from '../../index.pkg.mjs';

export type RootProps = {
  fill?: boolean;
  style?: t.CssValue;
};

export const Root: React.FC<RootProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      Absolute: props.fill ? 0 : undefined,
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      padding: 20,
      fontFamily: 'sans-serif',
      fontSize: 22,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div>{Pkg.toString()}</div>
      <div>{`🐷 <Root>`}</div>
    </div>
  );
};

/**
 * <Root> that fills the screen (absolute positioning)
 * Use for entry.
 */
export const RootFill: React.FC<RootProps> = (props) => {
  return <Root fill={true} {...props} />;
};

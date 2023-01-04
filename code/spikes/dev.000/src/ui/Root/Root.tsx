import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx } from '../common';
import { Pkg } from '../../index.pkg.mjs';
import { Footer } from './Root.Footer';

export type RootProps = {
  fill?: boolean;
  style?: t.CssValue;
};

export const Root: React.FC<RootProps> = (props) => {
  const href = '?dev';

  /**
   * [Render]
   */
  const styles = {
    base: css({
      Absolute: props.fill ? 0 : undefined,
      fontFamily: 'sans-serif',
      color: COLORS.DARK,
      fontSize: 14,
      display: 'grid',
      gridTemplateRows: '1fr auto',
    }),
    body: css({
      display: 'grid',
      justifyContent: 'center',
      alignContent: 'center',
      fontSize: 80,
    }),
    a: css({
      color: COLORS.CYAN,
      fontWeight: 'bold',
      textDecoration: 'none',
      ':hover': { textDecoration: 'underline' },
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body}>
        <a {...styles.a} href={href}>
          {href}
        </a>
      </div>

      <Footer />
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

import React, { useEffect, useRef, useState } from 'react';
import { COLORS, css, t, rx, FC } from '../common/index.mjs';
import { Pkg } from '../../index.pkg.mjs';

export type AppProps = { style?: t.CssValue };

export const App: React.FC<AppProps> = (props) => {
  const [el, setElement] = useState<JSX.Element | undefined>();

  useEffect(() => {
    //
    (async () => {
      const m = await import('./Markdown');
      setElement(<m.Markdown />);
    })();
  }, []);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      Absolute: 0,
      fontSize: 30,
      fontFamily: 'sans-serif',
      color: COLORS.DARK,
      padding: [30, 70],
    }),
  };
  return (
    <div {...css(styles.base, props.style)}>
      <div>Hello Report 🇺🇳</div>
      {el}
    </div>
  );
};

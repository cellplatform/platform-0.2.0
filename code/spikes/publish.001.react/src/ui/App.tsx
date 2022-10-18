import React, { useEffect, useRef, useState } from 'react';
import { css, t, rx, FC } from './common/index.mjs';
import { Pkg } from '../index.pkg.mjs';

export type AppProps = { style?: t.CssValue };

export const App: React.FC<AppProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      Absolute: 0,
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      fontSize: 30,
      padding: [30, 70],
    }),
  };
  return (
    <div {...css(styles.base, props.style)}>
      <div>{'This is the markdown renderer app (react).'}</div>
      <div>
        <pre>{JSON.stringify(Pkg, null, '  ')}</pre>
      </div>
    </div>
  );
};

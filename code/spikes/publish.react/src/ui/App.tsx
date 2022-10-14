import React, { useEffect, useRef, useState } from 'react';
import { css, t, rx, FC } from './common/index.mjs';

export type AppProps = { style?: t.CssValue };

export const App: React.FC<AppProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({ backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */ }),
  };
  return <div {...css(styles.base, props.style)}>App 🐷</div>;
};

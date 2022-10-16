import React, { useEffect, useState } from 'react';

import iconLogoUrl from '../../assets/favicon.png?url';
import { COLORS, css, t } from '../../common/index.mjs';
import { AppBody } from './App.Body';

export type AppProps = {
  version?: string;
  style?: t.CssValue;
};

export const App: React.FC<AppProps> = (props) => {
  const { version = '0.0.0' } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      Absolute: 0,
      fontFamily: 'sans-serif',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <AppBody />
    </div>
  );
};

export default App;

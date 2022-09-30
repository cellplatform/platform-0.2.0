import React from 'react';
import { t, FC, css } from './common/index.mjs';

export type AppProps = { style?: t.CssValue };

const View: React.FC<AppProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      Absolute: 0,
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      fontFamily: 'sans-serif',
      Flex: 'y-center-center',
    }),
    h1: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      textAlign: 'center',
      fontSize: 80,
    }),
  };
  return (
    <div {...css(styles.base, props.style)}>
      <h1 {...styles.h1}>Hello World 🐷</h1>
    </div>
  );
};

/**
 * Export
 */
type Fields = {};
export const App = FC.decorate<AppProps, Fields>(View, {}, { displayName: 'Foo' });

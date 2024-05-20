import React from 'react';
import { FC, css, type t } from './common.mjs';

export type AppProps = { style?: t.CssValue };

const View: React.FC<AppProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      Absolute: 0,
      fontFamily: 'sans-serif',
      Flex: 'y-center-center',
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
    h1: css({
      textAlign: 'center',
      fontSize: 80,
      PaddingY: 20,
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
    version: css({
      Absolute: [10, 15, null, null],
      fontFamily: 'monospace',
      fontWeight: 700,
      fontSize: 16,
    }),
  };

  const version = '0.0.0';

  return (
    <div {...css(styles.base, props.style)}>
      <h1 {...styles.h1}>Hello World! 🐷 🇺🇳</h1>
      <div {...styles.version}>{version}</div>
    </div>
  );
};

/**
 * Export
 */
type Fields = {};
export const App = FC.decorate<AppProps, Fields>(View, {}, { displayName: 'Foo' });

import React, { useEffect, useState } from 'react';

import { FC } from 'sys.util.react';
import { createRoot } from 'react-dom/client';
import { css, CssValue } from 'sys.util.css';

export type FooProps = { style?: CssValue };

const View: React.FC<FooProps> = (props) => {
  useEffect(() => {
    //
  }, []);

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
      fontSize: 60,
    }),
  };
  return (
    <div {...css(styles.base, props.style)}>
      <h1 {...styles.h1}>Hello World 🐷</h1>
    </div>
  );
};

type Fields = {};
export const Foo = FC.decorate<FooProps, Fields>(View, {}, { displayName: 'Foo' });

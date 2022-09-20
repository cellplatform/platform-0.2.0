import React from 'react';
import { createRoot } from 'react-dom/client';
import { css } from 'sys.util.css';

export {};

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
  }),
};

const el = (
  <div {...styles.base}>
    <h1 {...styles.h1}>Hello World</h1>
  </div>
);

const root = createRoot(document.body);
root.render(el);

import React, { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, FC } from './common.mjs';

import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';

export type AppProps = { style?: t.CssValue };

export const App: React.FC<AppProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      Absolute: 0,
      padding: 50,
    }),
  };
  return (
    <div {...css(styles.base, props.style)}>
      <Editor height="90vh" defaultLanguage="javascript" defaultValue="// some comment" />
    </div>
  );
};

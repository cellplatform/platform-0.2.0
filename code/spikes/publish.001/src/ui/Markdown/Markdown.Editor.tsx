import React, { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, FC } from '../common.mjs';

export type MarkdownEditorProps = {
  md: string;
  style?: t.CssValue;
};

export const MarkdownEditor: React.FC<MarkdownEditorProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
  };
  return (
    <div {...css(styles.base, props.style)}>
      <div>MarkdownEditor 🐷</div>
      <pre>{props.md}</pre>
    </div>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, FC } from '../common.mjs';

import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';

export type MarkdownEditorProps = {
  md: string;
  style?: t.CssValue;
  onChange?: (e: { text: string }) => void;
};

export const MarkdownEditor: React.FC<MarkdownEditorProps> = (props) => {
  const { md } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative' }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <Editor
        height={'90vh'}
        defaultLanguage={'markdown'}
        defaultValue={md}
        onChange={(text = '') => props.onChange?.({ text })}
      />
    </div>
  );
};

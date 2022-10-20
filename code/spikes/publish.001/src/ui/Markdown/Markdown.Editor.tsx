import React, { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, FC } from '../common.mjs';

import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import type { OnChange } from '@monaco-editor/react';

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

/**
 * REF: https://github.com/suren-atoyan/monaco-react
 */
export type Monaco = typeof monaco;
export type MonacoEditor = monaco.editor.IStandaloneCodeEditor;

export type MarkdownEditorProps = {
  markdown: string;
  focusOnLoad?: boolean;
  style?: t.CssValue;
  onChange?: (e: { text: string }) => void;
};

export const MarkdownEditor: React.FC<MarkdownEditorProps> = (props) => {
  const { markdown, focusOnLoad } = props;
  const editorRef = useRef<MonacoEditor>();

  /**
   * Lifecycle/handlers
   */

  function handleEditorDidMount(editor: MonacoEditor, monaco: Monaco) {
    editorRef.current = editor;

    console.log('editor', editor);
    console.log('monaco', monaco);

    /**
     * TODO 🐷
     * - Focus: make optional
     */
    if (focusOnLoad) editor.focus();
  }

  function getValue() {
    const value = editorRef.current?.getValue();
    return value ?? '';
  }

  const handleChange: OnChange = (text = '') => {
    /**
     * TODO 🐷
     */
    // const value = getValue();
    props.onChange?.({ text });
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative', flex: 1 }),
    inner: css({ Absolute: 0 }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.inner}>
        <Editor
          defaultLanguage={'markdown'}
          defaultValue={markdown}
          onMount={handleEditorDidMount}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

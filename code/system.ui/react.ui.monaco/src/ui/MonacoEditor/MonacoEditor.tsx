import EditorReact from '@monaco-editor/react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { useEffect, useRef } from 'react';

import { css, t, FC } from '../common';
import { LANGUAGES } from './const.mjs';

import type { OnChange } from '@monaco-editor/react';

/**
 * REF: https://github.com/suren-atoyan/monaco-react
 */
export type Monaco = typeof monaco;
export type MonacoEditor = monaco.editor.IStandaloneCodeEditor;

export type MonacoEditorProps = {
  text?: string;
  language?: t.EditorLanguage;
  focusOnLoad?: boolean;
  style?: t.CssValue;
  onChange?: (e: { text: string }) => void;
};

const View: React.FC<MonacoEditorProps> = (props) => {
  const { text, language = 'markdown' } = props;
  const editorRef = useRef<MonacoEditor>();

  /**
   * [Lifecycle]
   */
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    if (text !== editor.getValue()) {
      editor.setValue(text ?? '');
    }
  }, [text]);

  /**
   * [Handlers]
   */
  function handleEditorDidMount(editor: MonacoEditor, monaco: Monaco) {
    editorRef.current = editor;
    if (props.focusOnLoad) editor.focus();
  }

  const handleChange: OnChange = (text = '') => {
    props.onChange?.({ text });
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative' }),
    inner: css({ Absolute: 0 }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.inner}>
        <EditorReact
          defaultLanguage={language}
          language={language}
          defaultValue={text}
          onMount={handleEditorDidMount}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

/**
 * Export
 */
type Fields = {
  languages: typeof LANGUAGES;
};
export const MonacoEditor = FC.decorate<MonacoEditorProps, Fields>(
  View,
  { languages: LANGUAGES },
  { displayName: 'MonacoEditor' },
);

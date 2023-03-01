import EditorReact from '@monaco-editor/react';
import { useEffect, useRef } from 'react';

import { css, t, FC, LANGUAGES, DEFAULTS } from './common';

import type { OnChange, OnMount } from '@monaco-editor/react';

export type MonacoEditorProps = {
  text?: string;
  language?: t.EditorLanguage;
  focusOnLoad?: boolean;
  tabSize?: number;
  style?: t.CssValue;
  onChange?: t.MonacoEditorChangeHandler;
  onReady?: t.MonacoEditorReadyHandler;
};

const View: React.FC<MonacoEditorProps> = (props) => {
  const { text, language = DEFAULTS.language, tabSize = DEFAULTS.tabSize } = props;
  const editorRef = useRef<t.MonacoCodeEditor>();

  /**
   * [Lifecycle]
   */
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    if (text !== editor.getValue()) editor.setValue(text ?? '');
  }, [text]);

  useEffect(() => {
    editorRef.current?.getModel()?.updateOptions({ tabSize });
  }, [tabSize]);

  /**
   * [Handlers]
   */
  const handleEditorDidMount: OnMount = (ed, monaco) => {
    const editor = ed as unknown as t.MonacoCodeEditor;
    editorRef.current = editor;
    editor.getModel()?.updateOptions({ tabSize });
    if (props.focusOnLoad) editor.focus();
    props.onReady?.({ editor, monaco });
  };

  const handleChange: OnChange = (text = '', event) => {
    props.onChange?.({ text, event });
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
  DEFAULTS: typeof DEFAULTS;
  languages: typeof LANGUAGES;
};
export const MonacoEditor = FC.decorate<MonacoEditorProps, Fields>(
  View,
  { DEFAULTS, languages: LANGUAGES },
  { displayName: 'MonacoEditor' },
);

import EditorReact from '@monaco-editor/react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { useEffect, useRef } from 'react';

import { css, t, FC } from '../common';
import { LANGUAGES, DEFAULTS } from './const.mjs';

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
  tabSize?: number;
  style?: t.CssValue;
  onChange?: (e: { text: string }) => void;
  onReady?: (e: { editor: MonacoEditor; monaco: Monaco }) => void;
};

const View: React.FC<MonacoEditorProps> = (props) => {
  const { text, language = DEFAULTS.language, tabSize = DEFAULTS.tabSize } = props;
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

  useEffect(() => {
    editorRef.current?.getModel()?.updateOptions({ tabSize });
  }, [tabSize]);

  /**
   * [Handlers]
   */
  function handleEditorDidMount(editor: MonacoEditor, monaco: Monaco) {
    editorRef.current = editor;

    editor.getModel()?.updateOptions({ tabSize });

    if (props.focusOnLoad) editor.focus();
    props.onReady?.({ editor, monaco });
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
  DEFAULTS: typeof DEFAULTS;
  languages: typeof LANGUAGES;
};
export const MonacoEditor = FC.decorate<MonacoEditorProps, Fields>(
  View,
  { DEFAULTS, languages: LANGUAGES },
  { displayName: 'MonacoEditor' },
);

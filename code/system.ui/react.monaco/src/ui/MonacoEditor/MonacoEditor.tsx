import EditorReact from '@monaco-editor/react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { useEffect, useRef } from 'react';

import { css, t } from '../common';

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

export const MonacoEditor: React.FC<MonacoEditorProps> = (props) => {
  const { text, language = 'markdown' } = props;
  const editorRef = useRef<MonacoEditor>();

  /**
   * [Lifecycle]
   */
  useEffect(() => {
    const editor = editorRef.current;
    if (editor) {
      if (text !== editor.getValue()) {
        editor.setValue(text ?? '');
      }
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
          defaultValue={text}
          onMount={handleEditorDidMount}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

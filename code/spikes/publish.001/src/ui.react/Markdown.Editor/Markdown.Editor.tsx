import Editor from '@monaco-editor/react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { useRef, useEffect } from 'react';

import { css, t } from '../common.mjs';

import type { OnChange } from '@monaco-editor/react';

/**
 * REF: https://github.com/suren-atoyan/monaco-react
 */
export type Monaco = typeof monaco;
export type MonacoEditor = monaco.editor.IStandaloneCodeEditor;

export type MarkdownEditorProps = {
  markdown?: string;
  focusOnLoad?: boolean;
  style?: t.CssValue;
  onChange?: (e: { text: string }) => void;
};

export const MarkdownEditor: React.FC<MarkdownEditorProps> = (props) => {
  const { markdown, focusOnLoad } = props;
  const editorRef = useRef<MonacoEditor>();

  /**
   * [Lifecycle]
   */
  useEffect(() => {
    const editor = editorRef.current;
    if (editor && markdown !== editor.getValue()) {
      editor.setValue(markdown ?? '');
    }
  }, [markdown]);

  /**
   * [Handlers]
   */
  function handleEditorDidMount(editor: MonacoEditor, monaco: Monaco) {
    editorRef.current = editor;
    if (focusOnLoad) editor.focus();
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

import Editor from '@monaco-editor/react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { useRef } from 'react';

import { css, FC, t } from '../common.mjs';

import type { OnChange } from '@monaco-editor/react';

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

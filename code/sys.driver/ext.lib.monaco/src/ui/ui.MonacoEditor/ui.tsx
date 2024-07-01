import type { OnChange, OnMount } from '@monaco-editor/react';
import EditorReact from '@monaco-editor/react';

import { useEffect, useRef } from 'react';
import { DEFAULTS, Wrangle, css, type t } from './common';
import { Theme } from './u.Theme';

export const View: React.FC<t.MonacoEditorProps> = (props) => {
  const { text, language = DEFAULTS.language, tabSize = DEFAULTS.tabSize, placeholder } = props;
  const theme = Theme.toName(props.theme);

  const monacoRef = useRef<t.Monaco>();
  const editorRef = useRef<t.MonacoCodeEditor>();
  const editor = editorRef.current;

  /**
   * Lifecycle
   */
  useEffect(() => {
    if (!editor) return;
    if (text !== editor.getValue()) editor.setValue(text ?? '');
  }, [text]);

  useEffect(() => {
    editorRef.current?.getModel()?.updateOptions({ tabSize });
  }, [tabSize]);

  useEffect(() => {
    return () => {
      const editor = editorRef.current!;
      const monaco = monacoRef.current!;
      props.onDispose?.({ editor, monaco });
    };
  }, []);

  /**
   * Handlers
   */
  const handleEditorDidMount: OnMount = (ed, monaco) => {
    Theme.init(monaco);
    monacoRef.current = monaco;
    const editor = (editorRef.current = ed as unknown as t.MonacoCodeEditor);
    editor.updateOptions({ theme });
    editor.getModel()?.updateOptions({ tabSize });
    if (props.focusOnLoad) editor.focus();
    props.onReady?.({ editor, monaco });
  };

  const handleChange: OnChange = (text = '', event) => {
    const editor = editorRef.current;
    if (!props.onChange || !editor) return;

    const selections = editor.getSelections() || [];
    props.onChange({
      event,
      state: { text, selections },
    });
  };

  /**
   * Render
   */
  const styles = {
    base: css({ position: 'relative' }),
    inner: css({ Absolute: 0 }),
  };

  return (
    <div {...css(styles.base, props.style)} className={Wrangle.editorClassName(editor)}>
      <div {...styles.inner}>
        <EditorReact
          defaultLanguage={language}
          language={language}
          defaultValue={text}
          theme={theme}
          onMount={handleEditorDidMount}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

import type { OnChange, OnMount } from '@monaco-editor/react';
import EditorReact from '@monaco-editor/react';

import { useEffect, useRef, useState } from 'react';
import { Color, DEFAULTS, Wrangle, css, type t, Spinner } from './common';
import { Theme } from './u.Theme';

export const View: React.FC<t.MonacoEditorProps> = (props) => {
  const {
    text,
    language = DEFAULTS.props.language,
    tabSize = DEFAULTS.props.tabSize,
    readOnly = DEFAULTS.props.readOnly,
    minimap = DEFAULTS.props.minimap,
    enabled = DEFAULTS.props.enabled,
    placeholder,
  } = props;
  const editorTheme = Theme.toName(props.theme);
  const isPlaceholderText = typeof placeholder === 'string';

  const monacoRef = useRef<t.Monaco>();
  const editorRef = useRef<t.MonacoCodeEditor>();
  const [isEmpty, setIsEmpty] = useState(false);

  /**
   * Lifecycle
   */
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    if (text !== editor.getValue()) editor.setValue(text ?? '');
    updateTextState(editor);
  }, [text, editorRef.current]);

  useEffect(() => {
    updateOptions(editorRef.current);
  }, [editorRef.current, tabSize, readOnly, minimap]);

  /**
   * End-of-life.
   */
  useEffect(() => {
    return () => {
      const editor = editorRef.current!;
      const monaco = monacoRef.current!;
      props.onDispose?.({ editor, monaco });
    };
  }, []);

  /**
   * Updaters
   */
  const getModel = (editor?: t.MonacoCodeEditor) => {
    return editor?.getModel();
  };

  const updateOptions = (editor?: t.MonacoCodeEditor) => {
    if (!editor) return;
    editor.updateOptions({
      theme: editorTheme,
      readOnly,
      minimap: { enabled: minimap },
    });
    getModel(editor)?.updateOptions({
      tabSize,
    });
  };

  const updateTextState = (editor?: t.MonacoCodeEditor) => {
    if (!editor) return;
    const text = editor.getValue();
    setIsEmpty(!text);
  };

  /**
   * Handlers
   */
  const handleMount: OnMount = (ed, monaco) => {
    Theme.init(monaco);
    monacoRef.current = monaco;
    const editor = (editorRef.current = ed as unknown as t.MonacoCodeEditor);
    updateOptions(editor);
    updateTextState(editor);
    if (props.focusOnLoad) editor.focus();
    props.onReady?.({ editor, monaco });
  };

  const handleChange: OnChange = (text = '', event) => {
    const editor = editorRef.current;
    if (!props.onChange || !editor) return;

    updateTextState(editor);
    const selections = editor.getSelections() || [];
    props.onChange({
      event,
      state: { text, selections },
    });
  };

  /**
   * Render
   */
  const theme = Color.theme(props.theme);
  const className = Wrangle.editorClassName(editorRef.current);
  const styles = {
    base: css({
      position: 'relative',
      color: theme.fg,
      pointerEvents: enabled ? 'auto' : 'none',
      opacity: enabled ? 1 : 0.2,
    }),
    inner: css({ Absolute: 0 }),
    empty: {
      base: css({
        Absolute: 0,
        pointerEvents: 'none',
        display: 'grid',
      }),
      placeholderText: css({
        opacity: 0.3,
        justifySelf: 'center',
        padding: 40,
        fontSize: 14,
      }),
    },
  };

  const elPlaceholderText = isPlaceholderText && (
    <div {...styles.empty.placeholderText}>{placeholder}</div>
  );

  const elEmpty = isEmpty && placeholder && (
    <div {...styles.empty.base}>{elPlaceholderText ?? placeholder}</div>
  );

  const elLoading = <Spinner.Bar color={theme.fg} />;

  return (
    <div {...css(styles.base, props.style)} className={className}>
      <div {...styles.inner}>
        <EditorReact
          defaultLanguage={language}
          language={language}
          defaultValue={text}
          theme={editorTheme}
          loading={elLoading}
          onMount={handleMount}
          onChange={handleChange}
        />
        {elEmpty}
      </div>
    </div>
  );
};

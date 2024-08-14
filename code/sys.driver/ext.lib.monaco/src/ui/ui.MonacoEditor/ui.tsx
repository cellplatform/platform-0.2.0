import type { OnChange, OnMount } from '@monaco-editor/react';
import EditorReact from '@monaco-editor/react';
import { useEffect, useRef, useState } from 'react';

import { EditorCarets } from '../u.Editor.Carets';
import { Color, DEFAULTS, Spinner, Wrangle, css, rx, type t } from './common';
import { Util } from './u';

const def = DEFAULTS.props;

export const View: React.FC<t.MonacoEditorProps> = (props) => {
  const {
    text,
    language = def.language,
    tabSize = def.tabSize,
    readOnly = def.readOnly,
    minimap = def.minimap,
    enabled = def.enabled,
    placeholder,
  } = props;
  const editorTheme = Util.Theme.toName(props.theme);
  const isPlaceholderText = typeof placeholder === 'string';

  const disposeRef = useRef(rx.subject<void>());
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
      const dispose$ = disposeRef.current;
      dispose$.next();
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
    Util.Theme.init(monaco);
    monacoRef.current = monaco;

    const editor = (editorRef.current = ed as unknown as t.MonacoCodeEditor);
    updateOptions(editor);
    updateTextState(editor);
    if (enabled && props.focusOnLoad) editor.focus();

    let _carets: t.EditorCarets;
    const dispose$ = disposeRef.current;
    props.onReady?.({
      editor,
      monaco,
      dispose$,
      get carets() {
        return _carets || (_carets = EditorCarets.create(editor));
      },
    });
  };

  const handleChange: OnChange = (text = '', event) => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!props.onChange || !editor || !monaco) return;
    updateTextState(editor);

    props.onChange({
      event,
      monaco,
      editor,
      selections: Wrangle.Editor.selections(editor),
      content: Wrangle.Editor.content(editor),
    });
  };

  /**
   * Render
   */
  const className = Wrangle.Editor.className(editorRef.current);
  const theme = Color.theme(props.theme);
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

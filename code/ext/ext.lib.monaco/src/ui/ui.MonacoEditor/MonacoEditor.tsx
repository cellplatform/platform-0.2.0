import type { OnChange, OnMount } from '@monaco-editor/react';

import EditorReact from '@monaco-editor/react';
import { useEffect, useRef } from 'react';
import { DEFAULTS, FC, LANGUAGES, Wrangle, css, t } from './common';

const View: React.FC<t.MonacoEditorProps> = (props) => {
  const { text, language = DEFAULTS.language, tabSize = DEFAULTS.tabSize, placeholder } = props;
  const theme = Wrangle.toMonacoTheme(props.theme);

  const monacoRef = useRef<t.Monaco>();
  const editorRef = useRef<t.MonacoCodeEditor>();
  const editor = editorRef.current;

  /**
   * TODO 🐷
   */
  // console.log('placeholder', placeholder);

  /**
   * [Lifecycle]
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
   * [Handlers]
   */
  const handleEditorDidMount: OnMount = (ed, monaco) => {
    monacoRef.current = monaco;
    const editor = (editorRef.current = ed as unknown as t.MonacoCodeEditor);
    editor.getModel()?.updateOptions({ tabSize });
    if (props.focusOnLoad) editor.focus();
    props.onReady?.({ editor, monaco });

    /**
     * Customize theme
     */
    // monaco.editor.defineTheme('sys.monaco.base', {
    //   // base: theme as unknown,
    //   base: 'vs',
    //   inherit: true, // can also be false to completely replace the base theme
    //   rules: [],
    //   colors: {
    //     'editorLineNumber.foreground': '#FF0000', // Set your desired color here
    //   },
    // });
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
    <div {...css(styles.base, props.style)} className={Wrangle.editorClassName(editor)}>
      <div {...styles.inner}>
        <EditorReact
          defaultLanguage={language}
          language={language}
          theme={theme}
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
  className: typeof Wrangle.editorClassName;
};
export const MonacoEditor = FC.decorate<t.MonacoEditorProps, Fields>(
  View,
  {
    DEFAULTS,
    languages: LANGUAGES,
    className: Wrangle.editorClassName,
  },
  { displayName: 'MonacoEditor' },
);

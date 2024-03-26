import type { OnChange, OnMount } from '@monaco-editor/react';

import EditorReact from '@monaco-editor/react';
import { useEffect, useRef } from 'react';
import { DEFAULTS, FC, LANGUAGES, Wrangle, css, t } from './common';
import { Theme } from './u.Theme';

const View: React.FC<t.MonacoEditorProps> = (props) => {
  const { text, language = DEFAULTS.language, tabSize = DEFAULTS.tabSize, placeholder } = props;
  const theme = Theme.toName(props.theme);

  const monacoRef = useRef<t.Monaco>();
  const editorRef = useRef<t.MonacoCodeEditor>();
  const editor = editorRef.current;

  console.log('props.theme', props.theme);
  console.log('Theme', Theme);
  console.log('theme', theme);
  console.log('-------------------------------------------');

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
    Theme.init(monaco);
    monacoRef.current = monaco;
    const editor = (editorRef.current = ed as unknown as t.MonacoCodeEditor);
    editor.getModel()?.updateOptions({ tabSize });
    if (props.focusOnLoad) editor.focus();
    props.onReady?.({ editor, monaco });
    editor.updateOptions({ theme });

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
          defaultValue={text}
          theme={theme}
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

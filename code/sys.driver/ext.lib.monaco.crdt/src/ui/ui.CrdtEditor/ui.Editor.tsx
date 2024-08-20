import { useEffect, useState } from 'react';
import { css, DEFAULTS, Monaco, rx, type t } from './common';
import { editorController } from './ui.Editor.controller';

type P = EditorProps;
const DEF = DEFAULTS.props;

export type EditorProps = {
  doc?: t.Doc;
  editor?: t.CrdtEditorPropsEditor;
  enabled?: boolean;
  theme?: t.CommonTheme;
  style?: t.CssValue;
  onReady?: t.MonacoEditorReadyHandler;
};

export const Editor: React.FC<EditorProps> = (props) => {
  const { doc, editor } = wrangle.props(props);
  const enabled = wrangle.enabled(props);
  const [ready, setReady] = useState<t.MonacoEditorReadyArgs>();

  /**
   * Lifecycle
   */
  useEffect(() => {
    const { dispose$, dispose } = rx.disposable(ready?.dispose$);
    if (ready && doc) {
      const { monaco, editor } = ready;
      const { readOnly, dataPath, editorPath, identity } = wrangle.props(props).editor;
      editorController({
        monaco,
        editor,
        doc,
        identity,
        readOnly,
        dataPath,
        editorPath,
        dispose$,
      });
    }
    return dispose;
  }, [doc?.uri, !!ready]);

  /**
   * Render
   */
  const styles = {
    base: css({ display: 'grid' }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <Monaco.Editor
        theme={props.theme}
        language={'yaml'}
        enabled={enabled}
        readOnly={editor.readOnly}
        minimap={false}
        onReady={(e) => {
          setReady(e);
          props.onReady?.(e);
        }}
      />
    </div>
  );
};

/**
 * Helpers
 */
const wrangle = {
  props(props: P) {
    const { doc } = props;
    const editor = wrangle.editor(props);
    const enabled = wrangle.enabled(props);
    return { doc, editor, enabled } as const;
  },

  editor(props: P): t.CrdtEditorPropsEditor {
    const { editor = DEF.editor } = props;
    return editor;
  },

  enabled(props: P) {
    const { enabled = DEF.enabled } = props;
    const { doc, editor = DEF.editor } = props;
    if (!editor.dataPath || editor.dataPath.length === 0) return false;
    return !!doc && enabled;
  },
} as const;

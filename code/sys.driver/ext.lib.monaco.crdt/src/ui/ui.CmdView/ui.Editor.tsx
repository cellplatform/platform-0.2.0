import { css, DEFAULTS, Monaco, type t } from './common';

type P = EditorProps;
type C = t.CmdViewProps;
const def = DEFAULTS.props;

export type EditorProps = {
  doc?: C['doc'];
  editor?: t.CmdViewEditorProps;
  enabled?: boolean;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export const Editor: React.FC<EditorProps> = (props) => {
  const { doc, editor } = wrangle.props(props);
  const enabled = wrangle.enabled(props);

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
        // onDispose={(e) => controllerRef.current?.dispose()}
        onReady={(e) => {
          /**
           * TODO 🐷
           */
          // const { monaco, editor } = e;
          // controllerRef.current = editorController({ monaco, editor, main });
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
    const { doc, editor = def.editor } = props;
    return { doc, editor };
  },

  enabled(props: P) {
    const { enabled = def.enabled } = props;
    const { doc, editor } = wrangle.props(props);
    if (!editor.lens || editor.lens.length === 0) return false;
    return !!doc && enabled;
  },
} as const;

import { css, DEFAULTS, Monaco, type t } from './common';

type P = t.CmdViewProps;
const def = DEFAULTS.props;

export type EditorProps = {
  doc?: P['doc'];
  readOnly?: P['readOnly'];
  enabled?: boolean;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export const Editor: React.FC<EditorProps> = (props) => {
  const { doc, readOnly = def.readOnly } = props;
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
        readOnly={readOnly}
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
  enabled(props: P) {
    const { doc, enabled = def.enabled } = props;
    return !!doc && enabled;
  },
} as const;

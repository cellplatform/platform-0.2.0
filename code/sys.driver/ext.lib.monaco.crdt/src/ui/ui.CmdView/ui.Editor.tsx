import { css, DEFAULTS, Monaco, type t } from './common';

type P = t.CmdViewProps;

export type EditorProps = {
  doc?: P['doc'];
  readOnly?: P['readOnly'];
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export const Editor: React.FC<EditorProps> = (props) => {
  const { doc, readOnly = DEFAULTS.props.readOnly } = props;

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
        enabled={!!doc}
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

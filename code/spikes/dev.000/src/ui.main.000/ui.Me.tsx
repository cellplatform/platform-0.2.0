import { Color, Monaco, css, type t } from './common';
import { editorController } from './Me.codeEditor';

export type MeProps = {
  main: t.Main;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export const Me: React.FC<MeProps> = (props) => {
  const { main } = props;

  /**
   * Render
   */
  const theme = Color.theme(props.theme ?? 'Dark');
  const styles = {
    base: css({
      backgroundColor: theme.bg,
      color: theme.fg,
      display: 'grid',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <Monaco.Editor
        theme={theme.name}
        focusOnLoad={true}
        language={'yaml'}
        onReady={(e) => {
          const { monaco, editor } = e;
          editorController({ monaco, editor, main });
        }}
      />
    </div>
  );
};

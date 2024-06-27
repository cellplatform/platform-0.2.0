import { Color, Monaco, css, type t } from './common';
import { editorController } from './ui.Me.codeEditor';

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

          //           // Document (State)
          //           type T = { config?: string };
          //           const lens = Doc.lens(main.me, ['root'], { init: (d) => (d.root = {}) });
          //           lens.change((d) => delete d['code']);
          //           Syncer.listen<T>(monaco, editor, lens, ['config'], {});
          //
          //           // Editor
          //           const cmdbar = CmdBar.Ctrl.methods(main.cmd.cmdbar);
          //           editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, () => cmdbar.focus({}));
        }}
      />
    </div>
  );
};

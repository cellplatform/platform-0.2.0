import { Monaco } from 'ext.lib.monaco.crdt';
import { Color, Doc, css, type t } from './common';

const Syncer = Monaco.Crdt.Syncer;

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
          console.info(`⚡️ MonacoEditor.onReady`);
          const { monaco, editor } = e;
          type T = { code?: string };
          const lens = Doc.lens(main.me, ['root'], { init: (d) => (d.root = {}) });
          Syncer.listen<T>(monaco, editor, lens, ['code'], {});
        }}
      />
    </div>
  );
};

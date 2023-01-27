import { t, Dev } from '../../test.ui';
import { MonacoEditor, MonacoEditorProps } from '.';

const DEFAULTS = MonacoEditor.DEFAULTS;

type T = { props: MonacoEditorProps };
const initial: T = {
  props: {
    language: DEFAULTS.language,
    tabSize: DEFAULTS.tabSize,
    focusOnLoad: true,
  },
};

export default Dev.describe('MonacoEditor', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<T>(initial);
    ctx.subject
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        const props = e.state.props;
        return <MonacoEditor {...props} onReady={(e) => console.info(`⚡️ onReady:`, e)} />;
      });
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'info'} data={e.state} expand={1} />);

    dev.section('Language', (dev) => {
      const language = (name: t.EditorLanguage) => {
        dev.button(`${name}`, (e) => e.change((d) => (d.props.language = name)));
      };

      MonacoEditor.languages.forEach((name) => language(name));
      dev.hr();
    });

    dev.section('Options', (dev) => {
      const tabSize = (size: number) =>
        dev.button(`tabSize: ${size}`, (e) => {
          e.change((d) => (d.props.tabSize = size));
        });
      tabSize(2);
      tabSize(4);
    });
  });
});

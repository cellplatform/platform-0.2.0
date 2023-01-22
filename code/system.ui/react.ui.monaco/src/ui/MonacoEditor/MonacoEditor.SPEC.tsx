import { t, Dev } from '../../test.ui';
import { MonacoEditor, MonacoEditorProps } from '.';

type T = { props: MonacoEditorProps };
const initial: T = {
  props: {
    language: 'markdown',
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
        console.log('render', props);
        return <MonacoEditor {...props} />;
      });
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'info'} data={e.state} expand={1} />);

    const language = (name: t.EditorLanguage) => {
      dev.button(`${name}`, (e) => e.change((d) => (d.props.language = name)));
      return { language };
    };

    dev.title('Language');
    MonacoEditor.languages.forEach((name) => language(name));
    dev.hr();
  });
});

import { t, Dev } from '../../test.ui';
import { MonacoEditor } from '.';

import type { MonacoEditorProps } from '.';

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
        return <MonacoEditor {...e.state.props} onReady={(e) => console.info(`⚡️ onReady:`, e)} />;
      });
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'info'} data={e.state} expand={1} />);

    dev.section('Language', (dev) => {
      const language = (input: t.EditorLanguage | '---') => {
        if (input.startsWith('---')) return dev.hr(-1, 5);
        const name = input as t.EditorLanguage;
        return dev.button(name, (e) => e.change((d) => (d.props.language = name)));
      };
      language('typescript');
      language('javascript');
      language('---');
      language('json');
      language('yaml');
      language('---');
      language('markdown');
    });

    dev.hr(5, 20);

    dev.section('Options', (dev) => {
      const tabSize = (size: number) => {
        const label = `tabSize: ${size}`;
        dev.button(label, (e) => e.change((d) => (d.props.tabSize = size)));
      };
      tabSize(2);
      tabSize(4);
    });
  });
});

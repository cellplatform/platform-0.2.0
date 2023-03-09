import { Dev } from '../../test.ui';
import { CmdHost } from './ui.CmdHost';
import { Pkg } from '../../index.pkg.mjs';
import type { CmdHostProps } from './ui.CmdHost';

const specs = {
  foo: () => import('../DevTools/-SPEC'),
  foobar: () => import('../DevTools/-SPEC'),
  bar: () => import('../DevTools/-SPEC'),
  bars: () => import('../DevTools/-SPEC'),
  'bars.boo': () => import('../DevTools/-SPEC'),
  boo: () => import('../DevTools/-SPEC'),
  zoo: () => import('../DevTools/-SPEC'),
};

type T = { props: CmdHostProps };
const initial: T = { props: { pkg: Pkg, imports: specs } };

export default Dev.describe('CmdHost', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    ctx.subject
      .size('fill')
      .display('grid')
      .backgroundColor(1)
      .render<T>((e) => {
        return (
          <CmdHost
            {...e.state.props}
            onFilterChanged={(e) => state.change((d) => (d.props.filter = e.filter))}
          />
        );
      });
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'spec.CmdHost'} data={e.state} expand={1} />);
  });
});

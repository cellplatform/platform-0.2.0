import { Dev } from '../../test.ui';
import { CmdHost } from './ui.CmdHost';
import type { CmdHostProps } from './ui.CmdHost';

const specs = {
  foo: () => import('../DevTools/-SPEC'),
  bar: () => import('../DevTools/-SPEC'),
};

type T = { props: CmdHostProps };
const initial: T = { props: { specs } };

export default Dev.describe('CmdHost', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<T>(initial);
    ctx.subject
      .size('fill')
      .display('grid')
      .backgroundColor(1)
      .render<T>((e) => {
        return <CmdHost {...e.state.props} />;
      });
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'spec.CmdHost'} data={e.state} expand={1} />);
  });
});

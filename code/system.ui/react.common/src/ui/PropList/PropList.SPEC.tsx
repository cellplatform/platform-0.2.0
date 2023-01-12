import { Dev, expect } from '../../test.ui';

type T = { count: number };
const initial: T = { count: 0 };

export default Dev.describe('PropList', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<T>(initial);
    ctx.component
      .display('grid')
      .backgroundColor(1)
      .size(250, null)
      .render<T>((e) => <div>{`🐷 Hello-${e.state.count}`}</div>);
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.ctx.debug.footer
      .border(-0.1)
      .render<T>((e) => <Dev.ObjectView name={'state'} data={e.state} />);

    dev.button('tmp', (e) => e.change((d) => d.count++));
  });
});

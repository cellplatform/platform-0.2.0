import { Dev } from '../../test.ui';
import { DevSample } from './-dev/DEV.Sample';

type T = { count: number };
const initial: T = { count: 0 };

export default Dev.describe('KeyboardMonitor', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<T>(initial);
    ctx.subject
      .display('grid')
      .backgroundColor(1)
      .size(540, 300)
      .render<T>((e) => {
        return <DevSample />;
      });
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'KeyboardMonitor.spec'} data={e.state} expand={1} />);

    dev.button('tmp', (e) => e.change((d) => d.count++));
  });
});

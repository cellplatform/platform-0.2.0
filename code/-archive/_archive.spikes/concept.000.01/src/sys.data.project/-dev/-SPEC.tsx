import { Dev } from '../../test.ui';

type T = { count: number };
const initial: T = { count: 0 };

export default Dev.describe('sys.data.project', (e) => {
  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    ctx.subject
      .backgroundColor(1)
      .size([250, null])
      .display('grid')
      .render<T>((e) => {
        return <div>{`🐷 sys.data.project-${e.state.count}`}</div>;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.button('tmp', (e) => e.change((d) => d.count++));
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={'sys.data.project'} data={data} expand={1} />;
    });
  });
});

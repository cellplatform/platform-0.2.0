import { Dev, type t } from '../../test.ui';
import { Root } from '.';

type T = { props: t.RootProps };
const initial: T = { props: {} };

/**
 * Vime Docs:
 * https://vimejs.com/4.x/getting-started/installation#react
 */

export default Dev.describe('VimePlayer', (e) => {
  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);
    const state = await ctx.state<T>(initial);
    await state.change((d) => {});
    ctx.subject
      .backgroundColor(1)
      .size([500, 330])
      .display('grid')
      .render<T>((e) => {
        return <Root {...e.state.props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.TODO();
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={'VimePlayer'} data={data} expand={1} />;
    });
  });
});

import { type t, Dev } from '../test.ui';
import { LabelItemStateful } from '.';

type T = { props: t.LabelItemStatefulProps };
const initial: T = { props: {} };

export default Dev.describe('LabelItem.Stateful', (e) => {
  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    ctx.subject
      .backgroundColor(1)
      .size([250, null])
      .display('grid')
      .render<T>((e) => {
        return <LabelItemStateful {...e.state.props} />;
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
      return <Dev.Object name={'LabelItem.Stateful'} data={data} expand={1} />;
    });
  });
});

import { Dev, type t } from '../../../test.ui';
import { Root } from '..';
import { DATA } from './-sample.data.mjs';

type T = { props: t.RootStatefulProps };
const initial: T = { props: {} };

export default Dev.describe('Root (Stateful)', (e) => {
  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.slugs = DATA.slugs;
    });

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        return <Root.Stateful {...e.state.props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.title(['Stateful', '(Controller)']);
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={'Root (Stateful)'} data={data} expand={1} />;
    });
  });
});

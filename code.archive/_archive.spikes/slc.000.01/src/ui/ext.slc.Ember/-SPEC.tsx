import { Dev } from '../../test.ui';
import { Render } from './index.Render';

type T = {};
const initial: T = {};

const name = 'Ember';

export default Dev.describe(name, (e) => {
  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {});

    ctx.debug.width(0);
    ctx.subject
      .backgroundColor(1)
      .size('fill')
      .display('grid')
      .render<T>(async (e) => {
        const el = await Render.slc();
        // const el = await Render.pitch();
        return el;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    // dev.title(['Stateful', '(Controller)']);
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});

import { Root } from '.';
import { Dev, type t } from '../../test.ui';

type T = { props: t.SliderProps };
const initial: T = { props: {} };

export default Dev.describe('Slider', (e) => {
  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {});

    ctx.subject

      .size([350, null])
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
      return <Dev.Object name={'Slider'} data={data} expand={1} />;
    });
  });
});

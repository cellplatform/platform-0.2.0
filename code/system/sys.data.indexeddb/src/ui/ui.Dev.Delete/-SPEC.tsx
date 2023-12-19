import { Dev, Pkg, type t } from '../../test.ui';
import { DevDelete } from '.';

type T = { props: t.DevDeleteProps };
const initial: T = { props: {} };

/**
 * Spec
 */
const name = DevDelete.displayName ?? '';
export default Dev.describe(name, (e) => {
  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {});

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size([550, null])
      .display('grid')
      .render<T>((e) => {
        return <DevDelete {...e.state.props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
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

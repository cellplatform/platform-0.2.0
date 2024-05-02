import { Dev, Pkg, type t } from '../../test.ui';
import { DevDelete } from '.';

type P = t.DevDeleteProps;
type T = { props: P };
const initial: T = { props: {} };

/**
 * Spec
 */
const name = DevDelete.displayName ?? '';
export default Dev.describe(name, (e) => {
  type LocalStore = Pick<P, 'theme'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({ theme: undefined });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.theme = local.theme;
    });

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size([550, null])
      .display('grid')
      .render<T>((e) => {
        const { props } = e.state;
        Dev.Theme.background(ctx, props.theme, 1);
        return <DevDelete {...props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Properties', (dev) => {
      Dev.Theme.switch(dev, ['props', 'theme'], (e) => (local.theme = e));
    });
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

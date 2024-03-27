import { Dev, Pkg, type t } from '../../test.ui';

type P = {};
type T = { theme?: t.CommonTheme };
const initial: T = {};

/**
 * Spec
 */
const name = 'Sync.Textbox';

export default Dev.describe(name, (e) => {
  type LocalStore = Pick<T, 'theme'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({ theme: undefined });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.theme = local.theme;
    });

    ctx.debug.width(330);
    ctx.subject
      .size([250, null])
      .display('grid')
      .render<T>((e) => {
        const { theme } = e.state;
        Dev.Theme.background(ctx, theme, 1);

        return <div>{`🐷 ${name}`}</div>;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    const link = Dev.Link.pkg(Pkg, dev);
    dev.TODO();

    dev.section('Properties', (dev) => {
      Dev.Theme.switch(dev, ['theme'], (e) => (local.theme = e));
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={name} data={data} expand={1} fontSize={11} />;
    });
  });
});

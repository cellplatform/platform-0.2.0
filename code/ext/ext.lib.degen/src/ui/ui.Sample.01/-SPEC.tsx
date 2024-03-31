import { Dev, Pkg, type t, DegenHttp } from '../../test.ui';

type T = { theme?: t.CommonTheme };
const initial: T = {};

/**
 * Spec
 */
const name = 'Sample.01';
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
      .backgroundColor(1)
      .size([250, null])
      .display('grid')
      .render<T>((e) => {
        Dev.Theme.background(ctx, e.state.theme, 1);
        return <div>{`🐷 ${name}`}</div>;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    const link = Dev.Link.pkg(Pkg, dev);
    dev.TODO();

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
      Dev.Theme.switch(dev, ['theme'], (next) => (local.theme = next));

      dev.hr(5, 20);

      dev.button('tmp', async (e) => {
        const http = DegenHttp.http();

        /**
         * Causing a CORS error
         * TODO 🐷
         * - pass through our own proxy (deno instance)
         * - validate with JWT
         */
        const url = 'https://www.degen.tips/api/airdrop2/tip-allowance?fid=12567';
        const res = await http.get(url);
        console.log('url', url);
        console.log('res', res);
      });
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

import { css, Dev, Pkg, type t } from '../../test.ui';
import { KeyHint } from '.';

type P = t.KeyHintComboProps;
type T = { props: P };
const initial: T = { props: {} };

/**
 * Spec
 */
const name = 'suite';

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
    ctx.subject.display('grid').render<T>((e) => {
      const { props } = e.state;
      Dev.Theme.background(ctx, props.theme, 1);

      return <KeyHint.Combo {...props} />;
    });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    const link = Dev.Link.pkg(Pkg, dev);
    dev.TODO();

    dev.section('Properties', (dev) => {
      Dev.Theme.switch(dev, ['props', 'theme'], (e) => (local.theme = e));
    });

    dev.hr(-1, 5);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
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

import { DEFAULTS, Info } from '.';
import { Dev, Pkg, type t } from '../../test.ui';

type P = t.InfoProps;
type T = { props: P };
const initial: T = { props: {} };

/**
 * Spec
 */
const name = Info.displayName ?? 'Unknown';
export default Dev.describe(name, (e) => {
  type LocalStore = Pick<P, 'fields' | 'theme'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    theme: 'Dark',
    fields: DEFAULTS.fields.default,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    await state.change((d) => {
      d.props.fields = local.fields;
      d.props.theme = local.theme;
      d.props.margin = 10;
    });

    ctx.debug.width(300);
    ctx.subject
      .backgroundColor(1)
      .size([320, null])
      .display('grid')
      .render<T>((e) => {
        const { props } = e.state;
        Dev.Theme.background(ctx, props.theme, 1);
        return <Info {...props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    const link = Dev.Link.pkg(Pkg, dev);

    dev.section('Fields', (dev) => {
      dev.row((e) => {
        const props = e.state.props;
        return (
          <Dev.FieldSelector
            all={DEFAULTS.fields.all}
            selected={props.fields}
            onClick={(e) => {
              const next = e.next<t.InfoField>(DEFAULTS.fields.default);
              dev.change((d) => (local.fields = d.props.fields = next));
            }}
          />
        );
      });
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
      Dev.Theme.switch(dev, ['props', 'theme'], (next) => (local.theme = next));
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});

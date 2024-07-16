import { DEFAULTS, ModuleNamespace } from '.';
import { Dev, Pkg, type t } from '../../test.ui';
import { WrangleSpec } from './-SPEC.wrangle';

type T = {
  props: t.ModuleNamespaceListProps;
  debug: { debugBg?: boolean };
};
const initial: T = { props: {}, debug: {} };

/**
 * Spec: ModuleNamespace.List
 */
const name = `${DEFAULTS.displayName}.List`;
export default Dev.describe(name, (e) => {
  type LocalStore = T['debug'] & Pick<t.ModuleLoaderProps, 'theme'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    theme: DEFAULTS.theme,
    debugBg: true,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.theme = local.theme;
      d.debug.debugBg = local.debugBg;
    });

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size([250, null])
      .display('grid')
      .render<T>((e) => {
        WrangleSpec.mutateSubject(dev, e.state, { width: 330, height: null });
        return <ModuleNamespace.List {...e.state.props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const link = Dev.Link.pkg(Pkg, dev);
    const state = await dev.state();

    dev.section('', (dev) => {
      link.button('see: ModuleNamespace', 'Module.Namespace');
    });
    dev.hr(5, 20);

    dev.section('Properties', (dev) => {
      const buttonTheme = (theme: t.CommonTheme) => {
        dev.button((btn) => {
          const value = (state: T) => state.props.theme;
          const isCurrent = (state: T) => value(state) === theme;
          btn
            .label(`theme: "${theme}"`)
            .right((e) => (isCurrent(e.state) ? `←` : ''))
            .onClick((e) => e.change((d) => (local.theme = d.props.theme = theme)));
        });
      };
      buttonTheme('Light');
      buttonTheme('Dark');
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
      dev.hr(-1, 5);
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.debug.debugBg);
        btn
          .label((e) => `background: ${value(e.state) ? 'white' : '(none)'}`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.debugBg = Dev.toggle(d.debug, 'debugBg'))));
      });
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

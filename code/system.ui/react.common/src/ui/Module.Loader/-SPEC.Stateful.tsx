import { DEFAULTS, ModuleLoader } from '.';
import { Dev, Pkg, Time, type t } from '../../test.ui';
import { Sample } from './-SPEC.Components';
import { WrangleSpec } from './-SPEC.wrangle';

type T = {
  props: t.ModuleLoaderStatefulProps;
  debug: { debugBg?: boolean; debugFill?: boolean };
};
const initial: T = { props: {}, debug: {} };

/**
 * Spec: ModuleLoader.Stateful
 */
const name = `${DEFAULTS.displayName}.Stateful`;
export default Dev.describe(name, (e) => {
  type LocalStore = T['debug'] & Pick<t.ModuleLoaderStatefulProps, 'flipped' | 'theme'>;

  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    theme: DEFAULTS.theme,
    flipped: DEFAULTS.flipped,
    debugBg: true,
    debugFill: true,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.flipped = local.flipped;
      d.props.theme = local.theme;
      d.props.spinner = { bodyOpacity: 0.3, bodyBlur: 6 };

      d.debug.debugBg = local.debugBg;
      d.debug.debugFill = local.debugFill;
    });

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size([250, null])
      .display('grid')
      .render<T>((e) => {
        WrangleSpec.mutateSubject(dev, e.state);
        return <ModuleLoader.Stateful {...e.state.props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('', (dev) => {
      const link = WrangleSpec.link;
      link(dev, 'see: ModuleLoader (stateless)', 'Module.Loader');
      link(dev, 'see: ModuleLoader.Namespace', 'Module.Namespace');
    });

    dev.hr(5, 20);

    dev.section('Properties', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.flipped);
        btn
          .label((e) => `flipped`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.flipped = Dev.toggle(d.props, 'flipped'))));
      });

      dev.hr(-1, 5);

      const buttonTheme = (theme: t.ModuleLoaderTheme) => {
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

    dev.section('Factory', (dev) => {
      type A = t.ModuleLoaderRenderArgs;
      const sampleSyncFactory = (e: A) => {
        return <Sample {...e} text={'Sample'} />;
      };
      const sampleAsyncFactory = async (e: A) => {
        await Time.wait(1000);
        const { Sample } = await import('./-SPEC.Components');
        return <Sample {...e} text={'Sample (Loaded Async)'} />;
      };

      dev.button(['factory: sample', '(sync)'], (e) => {
        e.change((d) => (d.props.factory = sampleSyncFactory));
      });

      dev.button(['factory: sample', '(async)'], (e) => {
        e.change((d) => (d.props.factory = sampleAsyncFactory));
      });

      dev.hr(-1, 5);
      dev.button('unload', (e) => e.change((d) => (d.props.factory = undefined)));
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

      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.debug.debugFill);
        btn
          .label((e) => `size: ${value(e.state) ? 'filling screen' : 'specific contraint'}`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.debugFill = Dev.toggle(d.debug, 'debugFill'))));
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

import { DEFAULTS, ModuleLoader } from '.';
import { Dev, Pkg, Time, type t } from '../../test.ui';
import { Sample, SampleSpinner } from './-SPEC.Components';
import { WrangleSpec } from './-SPEC.wrangle';

type T = {
  props: t.ModuleLoaderProps;
  debug: { debugBg?: boolean; debugFill?: boolean; debugErrorCloseable?: boolean };
};
const initial: T = { props: {}, debug: {} };

/**
 * Spec: ModuleLoader
 */
const name = DEFAULTS.displayName;
export default Dev.describe(name, (e) => {
  type LocalStore = T['debug'] & Pick<t.ModuleLoaderProps, 'spinning' | 'theme'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    theme: DEFAULTS.theme,
    spinning: DEFAULTS.spinning,
    debugBg: true,
    debugFill: true,
    debugErrorCloseable: true,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.theme = local.theme;
      d.props.spinning = local.spinning;

      d.debug.debugBg = local.debugBg;
      d.debug.debugFill = local.debugFill;
      d.debug.debugErrorCloseable = local.debugErrorCloseable;
    });

    await state.change((d) => {
      d.props.element = <Sample text={'Element 👋'} theme={d.props.theme!} />;
    });

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .display('grid')
      .render<T>((e) => {
        WrangleSpec.mutateSubject(dev, e.state, { height: null });
        return (
          <ModuleLoader
            {...e.state.props}
            onError={(e) => {
              console.info('⚡️ onError', e);
              const closeable = state.current.debug.debugErrorCloseable;
              if (closeable) e.closeable();
              else Time.delay(2500, () => e.clear());
            }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    const reset = () => {
      dev.change((d) => {
        const p = d.props;
        local.theme = p.theme = DEFAULTS.theme;
        local.spinning = p.spinning = false;
        p.spinner = undefined;
      });
    };

    dev.section('', (dev) => {
      const link = Dev.Link.pkg(Pkg, dev);
      link.ns('see: ModuleLoader.Stateful', 'Module.Loader.Stateful');
      link.ns('see: ModuleLoader.Namespace', 'Module.Namespace');

      dev.hr(-1, 5);
      dev.button('reset', reset);
    });

    dev.hr(5, 20);

    dev.section('Properties', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.spinning);
        btn
          .label((e) => `spinning`)
          .value((e) => value(e.state))
          .onClick((e) =>
            e.change((d) => {
              const current = d.props.spinning;
              d.props.spinning = typeof current === 'boolean' ? !current : false;
              local.spinning = d.props.spinning;
            }),
          );
      });

      Dev.Theme.switch(
        dev,
        (d) => d.props.theme,
        (d, value) => (d.props.theme = value),
      );
    });

    dev.hr(5, 20);

    dev.section('Common State', (dev) => {
      dev.button('spinner → body blur', (e) => {
        e.change((d) => {
          const spinner = d.props.spinner || (d.props.spinner = {});
          spinner.bodyBlur = 3;
          spinner.bodyOpacity = 0.5;
        });
      });

      dev.button('spinner → <element>', (e) => {
        e.change((d) => {
          const spinner = d.props.spinner || (d.props.spinner = {});
          // spinner.element = <SampleSpinner theme={d.props.theme} />;
          spinner.element = (e) => <SampleSpinner theme={e.theme} />;
        });
      });

      dev.hr(-1, 5);
      dev.button('reset', reset);
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

      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.debug.debugErrorCloseable);
        btn
          .label((e) => (value(e.state) ? `error: closeable` : `error: not closeable (times out)`))
          .value((e) => value(e.state))
          .onClick((e) => {
            e.change(
              (d) => (local.debugErrorCloseable = Dev.toggle(d.debug, 'debugErrorCloseable')),
            );
          });
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

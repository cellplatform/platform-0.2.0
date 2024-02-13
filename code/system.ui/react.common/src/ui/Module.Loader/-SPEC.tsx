import { DEFAULTS, ModuleLoader } from '.';
import { Dev, Pkg, css, type t } from '../../test.ui';
import { SampleSpinner } from './-SPEC.Components';
import { WrangleSpec } from './-SPEC.wrangle';

type T = {
  props: t.ModuleLoaderProps;
  debug: { debugBg?: boolean; debugFill?: boolean };
};
const initial: T = { props: {}, debug: {} };

/**
 * Spec: ModuleLoader
 */
const name = DEFAULTS.displayName;
export default Dev.describe(name, (e) => {
  type LocalStore = T['debug'] & Pick<t.ModuleLoaderProps, 'flipped' | 'spinning' | 'theme'>;

  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    theme: DEFAULTS.theme,
    flipped: DEFAULTS.flipped,
    spinning: DEFAULTS.spinning,
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
      d.props.spinning = local.spinning;

      d.debug.debugBg = local.debugBg;
      d.debug.debugFill = local.debugFill;
    });

    await state.change((d) => {
      const render = (text: string) => {
        const style = css({ Padding: [5, 7], backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */ });
        return <div {...style}>{text}</div>;
      };
      d.props.front = { element: render('Front 👋') };
      d.props.back = { element: render('Back 👋') };
    });

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .display('grid')
      .render<T>((e) => {
        WrangleSpec.mutateSubject(dev, e.state);
        return <ModuleLoader {...e.state.props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('', (dev) => {
      const link = WrangleSpec.link;
      link(dev, 'see: ModuleLoader.Stateful', 'Module.Loader.Stateful');
      link(dev, 'see: ModuleLoader.Namespace', 'Module.Namespace');

      dev.hr(-1, 5);
      dev.button('reset', (e) => {
        e.change((d) => {
          const p = d.props;
          local.flipped = p.flipped = DEFAULTS.flipped;
          local.theme = p.theme = DEFAULTS.theme;
          local.spinning = p.spinning = false;
          p.spinner = undefined;
          // p.factory = undefined;
        });
      });
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

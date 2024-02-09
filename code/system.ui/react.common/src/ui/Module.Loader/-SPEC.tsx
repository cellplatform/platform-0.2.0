import { Color, COLORS, Dev, Pkg, type t } from '../../test.ui';
import { DEFAULTS, ModuleLoader } from '.';

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
    flipped: DEFAULTS.flipped,
    spinning: DEFAULTS.spinning,
    theme: DEFAULTS.theme,
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
      d.props.back = { element: <div>{'Back 👋'}</div> };
      d.debug.debugBg = local.debugBg;
    });

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .display('grid')
      .render<T>((e) => {
        const { props, debug } = e.state;
        const isDark = props.theme === 'Dark';
        ctx.subject.backgroundColor(debug.debugBg ? 1 : 0);
        ctx.host
          .backgroundColor(isDark ? COLORS.DARK : null)
          .tracelineColor(isDark ? Color.alpha(COLORS.WHITE, 0.1) : null);

        if (debug.debugFill) ctx.subject.size('fill', 80);
        if (!debug.debugFill) ctx.subject.size([350, 120]);

        return <ModuleLoader {...props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Properties', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.flipped);
        btn
          .label((e) => `flipped`)
          .value((e) => value(e.state))
          .onClick((e) =>
            e.change((d) => {
              local.flipped = Dev.toggle(d.props, 'flipped');
            }),
          );
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

      dev.hr(-1, 5);
      dev.button('reset', async (e) => {
        e.change((d) => {
          local.flipped = d.props.flipped = DEFAULTS.flipped;
          local.spinning = d.props.spinning = undefined;
        });
      });
    });

    dev.hr(5, 20);

    dev.section('Common State', (dev) => {
      dev.button('spinner → body blur', (e) => {
        e.change((d) => {
          const spinning =
            typeof d.props.spinning === 'object' ? d.props.spinning : (d.props.spinning = {});

          spinning.bodyBlur = 3;
          spinning.bodyOpacity = 0.5;
          local.spinning = spinning;
        });
      });
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
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
          .label((e) => `size: ${value(e.state) ? 'fill screen' : 'specific contraint'}`)
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

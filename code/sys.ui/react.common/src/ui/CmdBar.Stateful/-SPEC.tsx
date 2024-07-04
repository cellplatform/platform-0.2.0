import { DEFAULTS } from '.';
import { CmdBar } from '../CmdBar';
import { Time, css, Color, Dev, Pkg } from '../../test.ui';
import { type t } from './common';

type P = t.CmdBarStatefulProps;
type T = { props: P; debug: {} };
const initial: T = { props: {}, debug: {} };

/**
 * Spec
 */
const name = DEFAULTS.displayName;
export default Dev.describe(name, (e) => {
  type LocalStore = T['debug'] & Pick<P, 'theme' | 'enabled' | 'focusOnReady'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    theme: 'Dark',
    enabled: true,
    focusOnReady: true,
  });

  const ctrl = CmdBar.Ctrl.create();

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.ctrl = ctrl.cmd;
      d.props.theme = local.theme;
      d.props.enabled = local.enabled;
      d.props.focusOnReady = local.focusOnReady;
    });

    ctx.debug.width(330);
    ctx.subject
      .size('fill-x')
      .display('grid')
      .render<T>((e) => {
        const { props, debug } = e.state;
        Dev.Theme.background(dev, props.theme, 1);
        return (
          <CmdBar.Stateful
            {...props}
            onReady={(e) => {
              console.info('⚡️ CmdBar.Stateful.onReady:', e);
            }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    const link = Dev.Link.pkg(Pkg, dev);

    dev.section('Properties', (dev) => {
      Dev.Theme.switch(dev, ['props', 'theme'], (next) => (local.theme = next));
      dev.hr(-1, 5);
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.enabled);
        btn
          .label((e) => `enabled`)
          .value((e) => value(e.state))
          .onClick((e) => {
            e.change((d) => (local.enabled = Dev.toggle(d.props, 'enabled')));
          });
      });
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.focusOnReady);
        btn
          .label((e) => `focusOnReady`)
          .value((e) => value(e.state))
          .onClick((e) => {
            e.change((d) => (local.focusOnReady = Dev.toggle(d.props, 'focusOnReady')));
          });
      });
    });

    dev.hr(5, 20);

    dev.section('Controls', (dev) => {
      const focus = (select?: boolean) => {
        const invoke = () => Time.delay(0, () => ctrl.focus({ select }));
        dev.button(['cmd: Focus', select ? 'select' : ''], () => invoke());
      };
      focus(true);
      focus(false);
      dev.hr(-1, 5);
      dev.button('cmd: Invoke', (e) => ctrl.invoke({}));
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={name} data={data} expand={1} fontSize={11} />;
    });
  });
});

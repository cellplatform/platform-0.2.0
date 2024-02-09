import { Dev, Pkg, type t } from '../../test.ui';
import { DEFAULTS, ModuleLoader } from '.';

type T = {
  props: t.ModuleLoaderProps;
  debug: { debugBg?: boolean };
};
const initial: T = { props: {}, debug: {} };

/**
 * Spec
 */
const name = DEFAULTS.displayName;
export default Dev.describe(name, (e) => {
  type LocalStore = Pick<t.ModuleLoaderProps, 'flipped' | 'command'> & Pick<T['debug'], 'debugBg'>;

  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    flipped: false,
    command: DEFAULTS.command,
    debugBg: true,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      const p = d.props;
      p.flipped = local.flipped;
      p.command = local.command;
      d.debug.debugBg = local.debugBg;
    });

    ctx.debug.width(330);
    ctx.subject
      .size('fill', 80)
      .display('grid')
      .render<T>((e) => {
        const { props, debug } = e.state;
        ctx.subject.backgroundColor(debug.debugBg ? 1 : 0);
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
          .onClick((e) => e.change((d) => (local.flipped = Dev.toggle(d.props, 'flipped'))));
      });
    });

    dev.hr(-1, 5);

    dev.boolean((btn) => {
      const value = (state: T) => Boolean(state.props.command?.visible);
      btn
        .label((e) => `command.visible`)
        .value((e) => value(e.state))
        .onClick((e) =>
          e.change((d) => {
            const command = d.props.command || (d.props.command = DEFAULTS.command);
            Dev.toggle(command, 'visible');
            local.command = command;
          }),
        );
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.debug.debugBg);
        btn
          .label((e) => `background`)
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

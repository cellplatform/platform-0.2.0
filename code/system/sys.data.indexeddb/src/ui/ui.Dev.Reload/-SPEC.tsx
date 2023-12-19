import { DEFAULTS, DevReload } from '.';
import { COLORS, Dev, Pkg, type t } from '../../test.ui';

type T = {
  props: t.DevReloadProps;
  debug: { hidden?: boolean };
};
const initial: T = { props: {}, debug: {} };

/**
 * Spec
 */
const name = DevReload.displayName ?? '';
export default Dev.describe(name, (e) => {
  type LocalStore = Pick<t.DevReloadProps, 'isCloseable' | 'isReloadRequired'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    isCloseable: DEFAULTS.isCloseable,
    isReloadRequired: DEFAULTS.isReloadRequired,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.isCloseable = local.isCloseable;
      d.props.isReloadRequired = local.isReloadRequired;
    });

    ctx.debug.width(330);
    ctx.subject
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        if (e.state.debug.hidden) return <div />;

        return (
          <DevReload
            {...e.state.props}
            onCloseClick={() => state.change((d) => (d.debug.hidden = true))}
            style={{ backgroundColor: COLORS.WHITE }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Properties', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.isCloseable);
        btn
          .label((e) => `isCloseable`)
          .value((e) => value(e.state))
          .onClick((e) =>
            e.change((d) => (local.isCloseable = Dev.toggle(d.props, 'isCloseable'))),
          );
      });

      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.isReloadRequired);
        btn
          .label((e) => `isReloadRequired`)
          .value((e) => value(e.state))
          .onClick((e) =>
            e.change((d) => (local.isReloadRequired = Dev.toggle(d.props, 'isReloadRequired'))),
          );
      });
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('reset (hidden)', (e) => {
        state.change((d) => (d.debug.hidden = false));
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

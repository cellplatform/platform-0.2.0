import { DEFAULTS, DevReload } from '.';
import { COLORS, Dev, Pkg, type t } from '../../test.ui';

type P = t.DevReloadProps;
type T = {
  props: P;
  debug: { hidden?: boolean; onCloseClick?: boolean; onReloadClick?: boolean };
};
const initial: T = { props: {}, debug: {} };

/**
 * Spec
 */
const name = DevReload.displayName ?? '';
export default Dev.describe(name, (e) => {
  type LocalStore = Pick<P, 'isCloseable' | 'isReloadRequired' | 'theme'> &
    Pick<T['debug'], 'onCloseClick' | 'onReloadClick'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    theme: undefined,
    isCloseable: DEFAULTS.isCloseable,
    isReloadRequired: DEFAULTS.isReloadRequired,
    onCloseClick: true,
    onReloadClick: false,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.theme = local.theme;
      d.props.isCloseable = local.isCloseable;
      d.props.isReloadRequired = local.isReloadRequired;
      d.debug.onCloseClick = local.onCloseClick;
      d.debug.onReloadClick = local.onReloadClick;
    });

    const onCloseClick = () => state.change((d) => (d.debug.hidden = true));
    const onReloadClick = () => console.info(`⚡️ onReloadClick`);

    ctx.debug.width(330);
    ctx.subject
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        const { props, debug } = e.state;
        Dev.Theme.background(ctx, props.theme, 1, 0.06);
        if (debug.hidden) return <div />;

        return (
          <DevReload
            {...props}
            onCloseClick={debug.onCloseClick ? onCloseClick : undefined}
            onReloadClick={debug.onReloadClick ? onReloadClick : undefined}
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

      dev.hr(-1, 5);

      Dev.Theme.switch(dev, ['props', 'theme'], (next) => (local.theme = next));
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('reset (hidden)', (e) => {
        state.change((d) => (d.debug.hidden = false));
      });

      dev.hr(-1, 5);

      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.debug.onCloseClick);
        btn
          .label((e) => `onCloseClick`)
          .value((e) => value(e.state))
          .onClick((e) => {
            e.change((d) => (local.onCloseClick = Dev.toggle(d.debug, 'onCloseClick')));
          });
      });

      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.debug.onReloadClick);
        btn
          .label((e) => `onReloadClick`)
          .value((e) => value(e.state))
          .onClick((e) => {
            e.change((d) => (local.onReloadClick = Dev.toggle(d.debug, 'onReloadClick')));
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

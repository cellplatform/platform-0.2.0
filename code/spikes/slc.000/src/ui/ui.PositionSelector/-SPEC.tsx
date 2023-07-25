import { Dev, type t } from '../../test.ui';
import { PositionSelector } from '.';

const DEFAULTS = PositionSelector.DEFAULTS;

type T = { props: t.PositionSelectorProps };
const initial: T = {
  props: { size: 180 },
};

export default Dev.describe('PositionSelector', (e) => {
  type LocalStore = Pick<t.PositionSelectorProps, 'enabled' | 'selected'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.common.PositionSelector');
  const local = localstore.object({
    enabled: DEFAULTS.enabled,
    selected: DEFAULTS.selected,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);
    const state = await ctx.state<T>(initial);

    await state.change((d) => {
      d.props.enabled = local.enabled;
      d.props.selected = local.selected;
    });

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .display('grid')
      .render<T>((e) => {
        return (
          <PositionSelector
            {...e.state.props}
            onSelect={(e) => {
              console.info('⚡️ onSelect:', e.pos, e);
              state.change((d) => (d.props.selected = e.pos));
              local.selected = e.pos;
            }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.TODO().hr(5, 20);

    dev.section('Properties', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.enabled);
        btn
          .label((e) => `enabled`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => Dev.toggle(d.props, 'enabled')));
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const data = {
        props: e.state.props,
        'props:selected': e.state.props.selected,
      };
      return <Dev.Object name={'PositionSelector'} data={data} expand={1} />;
    });
  });
});

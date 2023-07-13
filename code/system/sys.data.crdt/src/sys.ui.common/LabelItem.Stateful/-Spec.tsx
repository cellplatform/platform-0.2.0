import { type t, Dev } from '../test.ui';
import { LabelItemStateful } from '.';

const DEFAULTS = LabelItemStateful.DEFAULTS;

type T = { props: t.LabelItemStatefulProps };
const initial: T = { props: {} };

export default Dev.describe('LabelItem.Stateful', (e) => {
  type LocalStore = Pick<t.LabelItemStatefulProps, 'useController'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.common.LabelItem.Stateful');
  const local = localstore.object({
    useController: DEFAULTS.useController,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    state.change((d) => {
      d.props.useController = local.useController;
    });

    ctx.debug.width(300);
    ctx.subject
      .backgroundColor(1)
      .size([280, null])
      .display('grid')
      .render<T>((e) => {
        return <LabelItemStateful {...e.state.props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Properties', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.useController);
        const isDefault = (state: T) => value(state) === DEFAULTS.useController;
        btn
          .label((e) => `useController ${isDefault(e.state) ? '(default)' : ''}`)
          .value((e) => value(e.state))
          .onClick((e) => {
            e.change((d) => (local.useController = Dev.toggle(d.props, 'useController')));
          });
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={'LabelItem.Stateful'} data={data} expand={1} />;
    });
  });
});

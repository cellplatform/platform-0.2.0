import { type t, Dev, Icons } from '../test.ui';
import { LabelItemStateful } from '.';
import { StateObject } from './StateObject.mjs';

const DEFAULTS = LabelItemStateful.DEFAULTS;

type T = {
  data?: t.LabelItemData;
  props: t.LabelItemStatefulProps;
  debug: {};
};
const initial: T = {
  props: {},
  debug: {},
};

export default Dev.describe('LabelItem.Stateful', (e) => {
  type LocalStore = Pick<t.LabelItemStatefulProps, 'useController'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.common.LabelItem.Stateful');
  const local = localstore.object({
    useController: DEFAULTS.useController,
  });

  const item = StateObject.init({
    initial: { label: 'hello 👋' },
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
        const { debug, props } = e.state;

        const rightAction: t.LabelAction = {
          kind: 'foobar',
          icon: (e) => <Icons.ObjectTree size={17} color={e.color} />,
          onClick: (e) => console.info('⚡️ action → onClick:', e),
        };

        return (
          <LabelItemStateful
            {...props}
            state={item}
            rightActions={[rightAction]}
            onChange={(e) => {
              console.info('⚡️ onChange', e);
              state.change((d) => (d.data = e.data));
            }}
          />
        );
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
      const data = {
        props: e.state.props,
        data: e.state.data,
      };
      return <Dev.Object name={'LabelItem.Stateful'} data={data} expand={1} />;
    });
  });
});

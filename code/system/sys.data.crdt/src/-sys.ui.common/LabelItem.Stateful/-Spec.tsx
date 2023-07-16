import { LabelItemStateful } from '.';
import { Item } from '..';
import { Dev, Icons, type t } from '../test.ui';

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
  type LocalStore = Pick<t.LabelItemStatefulProps, 'useEditController'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.common.LabelItem.Stateful');
  const local = localstore.object({
    useEditController: DEFAULTS.useEditController,
  });

  const item = Item.state({ initial: { label: 'hello 👋' } });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    state.change((d) => {
      d.props.useEditController = local.useEditController;
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
          /**
           * See: Examples of behavior/hook usages in component| ↓ |
           */
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

    dev.section('Behavior Logic', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.useEditController);
        const isDefault = (state: T) => value(state) === DEFAULTS.useEditController;
        btn
          .label((e) => `useEditController ${isDefault(e.state) ? '( 🧠 )' : '⚠️'}`)
          .value((e) => value(e.state))
          .onClick((e) => {
            e.change((d) => (local.useEditController = Dev.toggle(d.props, 'useEditController')));
          });
      });
    });

    dev.hr(-1, 5);
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

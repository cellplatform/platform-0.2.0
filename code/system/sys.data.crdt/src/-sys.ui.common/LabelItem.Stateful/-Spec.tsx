import { LabelItemStateful } from '.';
import { Item } from '..';
import { Dev, Icons, type t, PropList } from '../test.ui';

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
  type LocalStore = Pick<t.LabelItemStatefulProps, 'useControllers'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.common.LabelItem.Stateful');
  const local = localstore.object({
    useControllers: DEFAULTS.useControllers.default,
  });

  const item = Item.state({ initial: { label: 'hello 👋' } });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    state.change((d) => {
      d.props.useControllers = local.useControllers;
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
            item={item}
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

    dev.row((e) => {
      return (
        <PropList.FieldSelector
          title={'useControllers'}
          all={DEFAULTS.useControllers.all}
          selected={e.state.props.useControllers}
          showIndexes={true}
          resettable={true}
          onClick={async (e) => {
            let next = (e.next ?? []) as t.LabelItemControllerKind[];
            if (e.action === 'Reset') next = DEFAULTS.useControllers.default;
            await state.change((d) => (local.useControllers = d.props.useControllers = next));
          }}
        />
      );
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

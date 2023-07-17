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
  type LocalStore = Pick<t.LabelItemStatefulProps, 'useBehaviors'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.common.LabelItem.Stateful');
  const local = localstore.object({
    useBehaviors: DEFAULTS.useBehaviors.default,
  });

  const item = Item.State.init({ initial: { label: 'hello 👋' } });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    state.change((d) => {
      d.props.useBehaviors = local.useBehaviors;
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
          icon: (e) => <Icons.ObjectTree size={17} color={e.color} offset={[0, 1]} />,
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
        <LabelItemStateful.BehaviorSelector
          selected={e.state.props.useBehaviors}
          onChange={(e) => {
            state.change((d) => (local.useBehaviors = d.props.useBehaviors = e.next));
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

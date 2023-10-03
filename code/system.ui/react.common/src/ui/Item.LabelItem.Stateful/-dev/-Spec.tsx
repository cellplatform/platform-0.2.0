import { Dev, Value, type t } from '../../../test.ui';

import { LabelItemStateful } from '..';
import { Sample } from './-Sample';
import { SampleList } from './-Sample.List';

const DEFAULTS = LabelItemStateful.DEFAULTS;

type T = {
  data?: t.LabelItem;
  debug: {
    total?: number;
    useBehaviors?: t.LabelItemBehaviorKind[];
  };
};
const initial: T = {
  debug: {},
};

export default Dev.describe('LabelItem.Stateful', (e) => {
  type LocalStore = Pick<T['debug'], 'total' | 'useBehaviors'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.common.LabelItem.Stateful');
  const local = localstore.object({
    total: 1,
    useBehaviors: DEFAULTS.useBehaviors.defaults,
  });

  const TestState = {
    list: LabelItemStateful.State.list(),
    items: [] as t.LabelItemState[],
  };

  const Init = {
    item() {
      const initial = Sample.item();
      return LabelItemStateful.State.item(initial);
    },

    items(length: number = 0) {
      TestState.items = Array.from({ length }).map(() => Init.item());
    },
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    await state.change((d) => {
      d.debug.total = local.total;
      d.debug.useBehaviors = local.useBehaviors;
    });
    Init.items(state.current.debug.total);

    ctx.debug.width(300);
    ctx.subject
      .backgroundColor(1)
      .size([280, null])
      .display('grid')
      .render<T>((e) => {
        const { debug } = e.state;
        const length = debug.total ?? 0;
        const isList = length > 1;

        const elements = Array.from({ length }).map((_, i) => {
          return (
            <LabelItemStateful
              key={`item.${i}`}
              list={isList ? TestState.list : undefined}
              item={TestState.items[i]}
              useBehaviors={debug.useBehaviors}
              onChange={(e) => console.info(`⚡️ onChange[${i}]`, e)}
              renderCount={{ absolute: [0, -55, null, null] }}
            />
          );
        });

        if (!isList) return <>{elements}</>;
        return (
          <SampleList
            //
            items={TestState.items}
            elements={elements}
            useBehaviors={debug.useBehaviors}
            list={TestState.list}
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
          selected={e.state.debug.useBehaviors}
          onChange={(e) => {
            state.change((d) => (d.debug.useBehaviors = e.next));
            local.useBehaviors = e.next;
          }}
        />
      );
    });

    dev.hr(5, 20);

    dev.section((dev) => {
      const total = (total: number) => {
        const label = `${total} ${Value.plural(total, 'item', 'items')}`;
        dev.button((btn) =>
          btn
            .label(label)
            .right((e) => (e.state.debug.total === total ? '←' : ''))
            .onClick(async (e) => {
              Init.items(total);
              await e.change((d) => (local.total = d.debug.total = total));
            }),
        );
      };
      total(0);
      dev.hr(-1, 5);
      total(1);
      total(3);
      total(10);
      dev.hr(-1, 5);
      dev.button('add', async (e) => {
        TestState.items.push(Init.item());
        const total = (e.state.current.debug.total ?? 0) + 1;
        await e.change((d) => (local.total = d.debug.total = total));
      });
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
      const items = TestState.items.reduce((acc, next, i) => {
        const key = `${i}.${next.instance}`;
        acc[key] = next.current;
        return acc;
      }, {} as Record<string, t.LabelItemState['current']>);

      const data = {
        list: TestState.list.current,
        items,
      };

      return (
        <Dev.Object
          name={'LabelItem.Stateful'}
          data={data}
          expand={{ level: 1, paths: ['$', '$.items'] }}
        />
      );
    });
  });
});

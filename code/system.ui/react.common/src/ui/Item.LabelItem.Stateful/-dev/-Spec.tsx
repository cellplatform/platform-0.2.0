import { Dev, Value, type t } from '../../../test.ui';

import { LabelItem } from '../../Item.LabelItem';
import { Sample } from './-Sample';
import { SampleList } from './-Sample.List';

const DEFAULTS = LabelItem.Stateful.DEFAULTS;

type T = {
  data?: t.LabelItem;
  debug: {
    total?: number;
    useBehaviors?: t.LabelItemBehaviorKind[];
    renderCount?: boolean;
  };
};
const initial: T = {
  debug: {},
};

const name = LabelItem.Stateful.displayName ?? '';

export default Dev.describe(name, (e) => {
  type LocalStore = Pick<T['debug'], 'total' | 'useBehaviors' | 'renderCount'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.common.LabelItem.Stateful');
  const local = localstore.object({
    total: 1,
    useBehaviors: DEFAULTS.useBehaviors.defaults,
    renderCount: true,
  });

  const TestState = {
    list: LabelItem.Stateful.State.list(),
    items: [] as t.LabelItemState[],
    init: {
      item() {
        const initial = Sample.item();
        return LabelItem.Stateful.State.item(initial);
      },
      items(length: number = 0) {
        TestState.items = Array.from({ length }).map(() => TestState.init.item());
      },
    } as const,
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    await state.change((d) => {
      d.debug.total = local.total;
      d.debug.useBehaviors = local.useBehaviors;
      d.debug.renderCount = local.renderCount;
    });
    TestState.init.items(state.current.debug.total);

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
            <LabelItem.Stateful
              key={`item.${i}`}
              list={isList ? TestState.list : undefined}
              item={TestState.items[i]}
              useBehaviors={debug.useBehaviors}
              renderCount={debug.renderCount ? { absolute: [0, -55, null, null] } : undefined}
              onChange={(e) => {
                console.info(`⚡️ onChange[${i}]`, e);
              }}
            />
          );
        });

        // if (!isList) return <>{elements}</>;
        return (
          <SampleList
            //
            items={TestState.items}
            elements={elements}
            useBehaviors={debug.useBehaviors}
            list={TestState.list}
            renderCount={debug.renderCount ? { absolute: [-18, 0, null, null] } : undefined}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.row((e) => {
      return (
        <LabelItem.BehaviorSelector
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
              TestState.init.items(total);
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
        TestState.items.push(TestState.init.item());
        const total = (e.state.current.debug.total ?? 0) + 1;
        await e.change((d) => (local.total = d.debug.total = total));
      });
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.debug.renderCount);
        btn
          .label((e) => `render count`)
          .value((e) => value(e.state))
          .onClick((e) => {
            e.change((d) => (local.renderCount = Dev.toggle(d.debug, 'renderCount')));
          });
      });

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

      return <Dev.Object name={name} data={data} expand={{ level: 1, paths: ['$', '$.items'] }} />;
    });
  });
});

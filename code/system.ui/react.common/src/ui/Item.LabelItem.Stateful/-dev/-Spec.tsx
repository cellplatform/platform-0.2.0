import { Dev, Value, type t } from '../../../test.ui';

import { LabelItemStateful } from '..';
import { Item } from '../../Item';
import { Sample } from './-Sample';

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

  const State = {
    ctx: undefined as t.LabelItemListCtxState | undefined,
    items: [] as t.LabelItemState[],
  };

  const Init = {
    items(state: T) {
      const length = state.debug.total ?? 0;
      State.ctx = length > 1 ? Item.Label.State.ctx() : undefined;
      State.items = Array.from({ length }).map(() => {
        const initial = Sample.data();
        return Item.Label.State.item(initial);
      });
    },
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    await state.change((d) => {
      d.debug.total = local.total;
      d.debug.useBehaviors = local.useBehaviors;
    });
    Init.items(state.current);

    ctx.debug.width(300);
    ctx.subject
      .backgroundColor(1)
      .size([280, null])
      .display('grid')
      .render<T>((e) => {
        const { debug } = e.state;
        const length = debug.total ?? 0;
        const elList = Array.from({ length }).map((v, i) => {
          return (
            <LabelItemStateful
              key={`item.${i}`}
              ctx={State.ctx}
              item={State.items[i]}
              useBehaviors={debug.useBehaviors}
              onChange={(e) => {
                console.info(`⚡️ onChange[${i}]`, e);
                state.change((d) => (d.data = e.data));
              }}
            />
          );
        });
        return <>{elList}</>;
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
              await e.change((d) => (d.debug.total = total));
              Init.items(state.current);
              local.total = total;
              dev.redraw();
            }),
        );
      };
      total(0);
      dev.hr(-1, 5);
      total(1);
      total(3);
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.footer.border(-0.1).render<T>((e) => {
      const items = State.items.reduce((acc, next, i) => {
        const key = `${i}.${next.instance}`;
        acc[key] = next;
        return acc;
      }, {} as Record<string, t.LabelItemState>);

      const data = {
        ctx: State.ctx?.current,
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

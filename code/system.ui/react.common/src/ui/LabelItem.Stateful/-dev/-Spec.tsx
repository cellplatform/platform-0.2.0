import { Time, rx, Dev, Value, type t } from '../../../test.ui';
import { LabelItem } from '../../LabelItem';
import { Sample, type SampleActionKind } from './-Sample';
import { SampleList } from './-Sample.List';

const Model = LabelItem.Model;
const DEFAULTS = LabelItem.Stateful.DEFAULTS;

type T = {
  data?: t.LabelItem;
  debug: {
    debug?: boolean;
    total?: number;
    useBehaviors?: t.LabelItemBehaviorKind[];
    renderCount?: boolean;
    isList?: boolean;
  };
};
const initial: T = { debug: {} };

const name = LabelItem.Stateful.displayName ?? '';

export default Dev.describe(name, (e) => {
  type LocalStore = Pick<T['debug'], 'total' | 'useBehaviors' | 'renderCount' | 'debug' | 'isList'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.common.LabelItem.Stateful');
  const local = localstore.object({
    total: 1,
    useBehaviors: DEFAULTS.useBehaviors.defaults,
    renderCount: true,
    debug: false,
    isList: true,
  });

  const State = {
    get last() {
      return State.items[State.items.length - 1];
    },
    items: [] as t.LabelItemState[],
    list: Model.List.state(),
    renderers: Sample.renderers,
    init: {
      items(length: number = 0) {
        State.items = Array.from({ length }).map(() => State.init.item());
      },
      item(dispose$?: t.Observable<any>) {
        const Model = LabelItem.Stateful.Model;

        const { initial } = Sample.item();
        const state = Model.Item.state<SampleActionKind>(initial);
        const dispatch = Model.Item.commands(state);
        const events = state.events(dispose$);

        events.key.enter$.subscribe((e) => console.info('Enter', e));
        events.key.escape$.subscribe((e) => console.info('Escape', e));
        events.key.$.pipe(rx.filter((e) => e.code === 'KeyR')).subscribe((e) => {
          dispatch.redraw();
        });

        events.cmd.clipboard.cut$.subscribe((e) => console.info('🌳 cut', state.current));
        events.cmd.clipboard.copy$.subscribe((e) => console.info('🌳 copy', state.current));
        events.cmd.clipboard.paste$.subscribe((e) => console.info('💥 paste', state.current));

        events.cmd.action.$.subscribe((e) => console.info('🔥 command/action:', e));
        events.cmd.action.on('left').subscribe((e) => {
          console.info('🔥🔎 command/action filtered:', e);
        });

        events.cmd.changed$.subscribe((e) => console.info(`⚡️ changed$ [${e.position.index}]`, e));
        // events.cmd.click$.subscribe((e) => console.info(`⚡️ click$ [${e.position.index}]`, e));

        return state;
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
      d.debug.debug = local.debug;
      d.debug.isList = local.isList;
    });
    State.init.items(state.current.debug.total);

    ctx.debug.width(300);
    ctx.subject
      .backgroundColor(1)
      .size([280, null])
      .display('grid')
      .render<T>((e) => {
        const { debug } = e.state;
        const length = debug.total ?? 0;
        const elements = Array.from({ length }).map((_, i) => {
          const item = State.items[i];
          const renderCount: t.RenderCountProps = {
            absolute: [0, -55, null, null],
            opacity: 0.2,
          };
          return (
            <LabelItem.Stateful
              key={`item.${i}`}
              index={i}
              total={length}
              list={debug.isList ? State.list : undefined}
              item={item}
              renderers={State.renderers}
              useBehaviors={debug.useBehaviors}
              renderCount={debug.renderCount ? renderCount : undefined}
              debug={debug.debug}
              onChange={(e) => {
                // console.info(`⚡️ onChange[${i}]`, e);
              }}
            />
          );
        });

        return (
          <SampleList
            //
            items={State.items}
            elements={elements}
            useBehaviors={debug.useBehaviors}
            list={State.list}
            renderCount={
              debug.renderCount ? { absolute: [-18, 0, null, null], opacity: 0.2 } : undefined
            }
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
              State.init.items(total);
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
        State.items.push(State.init.item());
        const total = (e.state.current.debug.total ?? 0) + 1;
        await e.change((d) => (local.total = d.debug.total = total));
      });
    });

    dev.hr(5, 20);

    dev.section('Commands', (dev) => {
      const dispatch = Model.List.commands(State.list);
      dev.button('focus', (e) => Time.delay(0, dispatch.focus));
      dev.button('focus → blur', (e) =>
        Time.delay(0, () => {
          dispatch.focus();
          Time.delay(500, dispatch.blur);
        }),
      );

      dev.hr(-1, 5);

      const select = (item: number | string, focus?: boolean) => {
        Time.delay(0, () => dispatch.select(item, focus));
      };
      dev.button(['select: first', 'by index'], (e) => select(0));
      dev.button(['select: first, focus', 'by index'], (e) => select(0, true));
      dev.button(['select: first, focus', 'by id'], (e) => select(State.items[0].instance, true));
      dev.button(['select: last, focus', 'by id'], (e) => select(State.last.instance, true));
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.debug.debug);
        btn
          .label((e) => `debug`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.debug = Dev.toggle(d.debug, 'debug'))));
      });

      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.debug.renderCount);
        btn
          .label((e) => `render count`)
          .value((e) => value(e.state))
          .onClick((e) => {
            e.change((d) => (local.renderCount = Dev.toggle(d.debug, 'renderCount')));
          });
      });

      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.debug.isList);
        btn
          .label((e) => `is list`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => Dev.toggle(d.debug, 'isList')));
      });

      dev.hr(-1, 5);

      dev.button('redraw', (e) => dev.redraw());
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.footer.border(-0.1).render<T>((e) => {
      const items = State.items.reduce((acc, next, i) => {
        const key = `${i}.${next.instance}`;
        acc[key] = next.current;
        return acc;
      }, {} as Record<string, t.LabelItemState['current']>);

      const data = {
        list: State.list.current,
        items,
      };

      return <Dev.Object name={name} data={data} expand={{ level: 1, paths: ['$', '$.items'] }} />;
    });
  });
});

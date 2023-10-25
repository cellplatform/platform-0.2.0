import { Dev, Time, Value, rx, type t } from '../../../test.ui';
import { LabelItem } from '../../LabelItem';
import { Sample, type SampleActionKind } from './-Sample';
import { SampleList } from './-Sample.List';

const Model = LabelItem.Model;
const DEFAULTS = LabelItem.Stateful.DEFAULTS;

type T = {
  data?: t.LabelItem;
  debug: {
    debug?: boolean;
    useBehaviors?: t.LabelItemBehaviorKind[];
    renderCount?: boolean;
    isList?: boolean;
  };
};
const initial: T = { debug: {} };
const name = LabelItem.Stateful.displayName ?? '';

export default Dev.describe(name, (e) => {
  type LocalStore = Pick<T['debug'], 'useBehaviors' | 'renderCount' | 'debug' | 'isList'> & {
    total: number;
  };
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.common.LabelItem.Stateful');
  const local = localstore.object({
    useBehaviors: DEFAULTS.useBehaviors.defaults,
    total: 1,
    debug: false,
    renderCount: true,
    isList: true,
  });

  const TestState = {
    array: Model.List.array(), // NB: simple container of Item models.
    list: Model.List.state(), //  NB: the actual List state object (points into the ↑ array-list)
    init: {
      list(dev: t.DevCtxState<T>) {
        const list = TestState.list;
        list.events().cmd.remove$.subscribe((e) => {
          local.total = TestState.array.remove(e.index).length;
        });
      },
      items(dev: t.DevCtxState<T>, total: number = 0) {
        TestState.array = Model.List.array((i) => TestState.init.item(dev, i));
        TestState.array.getItem(total - 1);
        TestState.list.change((d) => {
          d.total = total;
          d.getItem = TestState.array.getItem;
          d.getRenderers = () => Sample.renderers;
        });
      },
      item(dev: t.DevCtxState<T>, index: number, dispose$?: t.Observable<any>) {
        const { initial } = Sample.item();
        const state = Model.Item.state<SampleActionKind>(initial);
        const dispatch = Model.Item.commands(state);
        const events = state.events(dispose$);

        events.key.enter$.subscribe((e) => console.info('Enter', e));
        events.key.escape$.subscribe((e) => console.info('Escape', e));
        events.key.$.pipe(rx.filter((e) => e.code === 'KeyR')).subscribe(dispatch.redraw);

        events.key.$.pipe(
          rx.filter((e) => e.is.shift),
          rx.filter((e) => e.code === 'KeyN'),
        ).subscribe((e) => TestState.add(dev, true));

        events.cmd.clipboard.cut$.subscribe((e) => console.info('🌳 cut', state.current));
        events.cmd.clipboard.copy$.subscribe((e) => console.info('🌳 copy', state.current));
        events.cmd.clipboard.paste$.subscribe((e) => console.info('💥 paste', state.current));

        events.cmd.action.$.subscribe((e) => console.info('🔥 command/action:', e));
        events.cmd.action.on('left').subscribe((e) => {
          console.info('🔥🔎 command/action filtered:', e);
        });
        events.cmd.action.on('right').subscribe((e) => {
          TestState.add(dev);
        });

        // events.cmd.changed$.subscribe((e) => console.info(`⚡️ changed$ [${e.position.index}]`, e));
        // events.cmd.click$.subscribe((e) => console.info(`⚡️ click$ [${e.position.index}]`, e));

        return state;
      },
    } as const,

    async add(dev: t.DevCtxState<T>, focus?: boolean) {
      const total = TestState.list.current.total + 1;
      TestState.list.change((d) => (d.total = total));
      local.total = total;
      if (focus) Model.List.commands(TestState.list).focus();
    },
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    await state.change((d) => {
      d.debug.useBehaviors = local.useBehaviors;
      d.debug.renderCount = local.renderCount;
      d.debug.debug = local.debug;
      d.debug.isList = local.isList;
    });
    TestState.init.list(state);
    TestState.init.items(state, local.total);

    ctx.debug.width(300);
    ctx.subject
      .backgroundColor(1)
      .size([280, null])
      .display('grid')
      .render<T>((e) => {
        const { debug } = e.state;
        const { isList, renderCount } = debug;
        return (
          <SampleList
            list={TestState.list}
            // renderers={Sample.renderers}
            useBehaviors={debug.useBehaviors}
            debug={{ isList, renderCount }}
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

    dev.section('Total', (dev) => {
      const total = (length: number) => {
        const label = `${length} ${Value.plural(length, 'item', 'items')}`;
        dev.button(label, (e) => {
          TestState.init.items(state, length);
          local.total = length;
        });
      };
      total(0);
      dev.hr(-1, 5);
      total(1);
      total(3);
      total(10);
      dev.hr(-1, 5);
      dev.button('add', (e) => TestState.add(state));
      dev.button('add → focus', (e) => TestState.add(state, true));
    });

    dev.hr(5, 20);

    dev.section('Commands', (dev) => {
      const dispatch = Model.List.commands(TestState.list);

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
      dev.button(['select: first', '[index]'], (e) => select(0));
      dev.button(['select: first, focus', '"id"'], (e) =>
        select(TestState.array.first.instance, true),
      );
      dev.hr(-1, 5);
      dev.button(['select: last, focus', '[index]'], (e) =>
        select(TestState.array.items.length - 1, true),
      );
      dev.button(['select: last, focus', '"id"'], (e) =>
        select(TestState.array.last.instance, true),
      );

      dev.hr(-1, 5);

      dev.button(['redraw: first', '[index]'], (e) => dispatch.redraw(0));
      dev.button(['redraw: first', '"id"'], (e) =>
        dispatch.redraw(TestState.array.first?.instance),
      );

      dev.hr(-1, 5);
      dev.button(['redraw: all', '(list)'], (e) => dispatch.redraw());

      dev.hr(-1, 5);

      dev.button('remove: [0]', (e) => dispatch.remove(0));
      dev.button('remove: [10]', (e) => dispatch.remove(10));
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

      dev.button(['redraw', '(harness)'], (e) => dev.redraw());
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.footer.border(-0.1).render<T>((e) => {
      const items = TestState.array.items.reduce((acc, next, i) => {
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

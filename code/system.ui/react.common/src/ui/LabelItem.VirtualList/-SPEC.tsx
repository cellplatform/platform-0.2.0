import { VirtualList } from '.';
import { Dev, type t } from '../../test.ui';
import { Sample, type SampleActionKind } from '../LabelItem.Stateful/-dev/-Sample';
import { LabelItem } from './common';

const Model = LabelItem.Model;

type T = {
  length?: number;
  props: t.VirtualListProps;
};
const initial: T = { props: {} };
const name = VirtualList.displayName ?? '';

export default Dev.describe(name, (e) => {
  type LocalStore = Pick<T, 'length'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.common.LabelItem.VirtualList');
  const local = localstore.object({ length: 999 });

  let vlist: t.VirtualListHandle;

  const TestState = {
    array: Model.List.array(), // NB: simple container of Item models.
    list: Model.List.state(), //  NB: the actual List state object (points into the ↑ array-list)
    init: {
      items(dev: t.DevCtxState<T>, length: number = 0) {
        TestState.array = Model.List.array((i) => TestState.init.item(dev, i));
        TestState.array.getItem(length - 1);
        TestState.list.change((d) => {
          d.total = length;
          d.getItem = TestState.array.getItem;
        });
      },
      item(dev: t.DevCtxState<T>, index: number, dispose$?: t.Observable<any>) {
        const { initial } = Sample.item();
        const state = Model.Item.state<SampleActionKind>(initial);
        return state;
      },
    },
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.length = local.length;
    });
    TestState.init.items(state, state.current.length);

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size('fill-y')
      .display('grid')
      .render<T>((e) => {
        return (
          <VirtualList
            list={TestState.list}
            renderers={Sample.renderers({})}
            style={{ width: 330 }}
            onReady={(e) => (vlist = e.vlist)}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Length', (dev) => {
      const total = (length: number) => {
        dev.button(`${length.toLocaleString()}`, (e) => {
          e.change((d) => (local.length = d.length = length));
          TestState.init.items(state, length);
        });
      };
      total(0);
      total(10);
      total(100);
      total(1000);
      total(10000);
      total(100000);
    });

    dev.hr(5, 20);

    dev.section(['Handle', 'ƒ( v-list )'], (dev) => {
      const scrollTo = (location: t.VirtialListScrollLocation) => {
        dev.button(`scroll to: ${location}`, (e) => {
          vlist.scrollTo(location);
        });
      };
      scrollTo(0);
      scrollTo(50);
      scrollTo(100);
      dev.hr(-1, 5);
      scrollTo('Last');
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});

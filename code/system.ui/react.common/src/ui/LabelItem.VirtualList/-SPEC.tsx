import { Dev, type t } from '../../test.ui';
import { VirtualList } from '.';
import { LabelItem } from './common';
import { Sample, type SampleActionKind } from '../LabelItem.Stateful/-dev/-Sample';
import type { VirtuosoHandle } from 'react-virtuoso';

const Model = LabelItem.Model;

type T = {
  total?: number;
  props: t.VirtualListProps;
};
const initial: T = { props: {} };
const name = VirtualList.displayName ?? '';

export default Dev.describe(name, (e) => {
  type LocalStore = Pick<T, 'total'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.common.LabelItem.VirtualList');
  const local = localstore.object({ total: 999 });

  let handle: VirtuosoHandle;

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
        // const dispatch = Model.Item.commands(state);
        // const events = state.events(dispose$);

        return state;
      },
    },
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.total = local.total;
    });
    TestState.init.items(state, state.current.total);

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size('fill-y')
      .display('grid')
      .render<T>((e) => {
        return (
          <VirtualList
            list={TestState.list}
            renderers={Sample.renderers}
            style={{ width: 330 }}
            onReady={(e) => (handle = e.ref)}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Total', (dev) => {
      const total = (total: number) => {
        dev.button(`${total.toLocaleString()}`, (e) => {
          e.change((d) => (local.total = d.total = total));
          TestState.init.items(state, total);
        });
      };
      total(0);
      total(10);
      total(100);
      total(1000);
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      const scrollTo = (index: number) => {
        dev.button(`scroll to: ${index}`, (e) => {
          handle.scrollToIndex({ index, behavior: 'smooth' });
        });
      };
      scrollTo(0);
      scrollTo(50);
      scrollTo(100);
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

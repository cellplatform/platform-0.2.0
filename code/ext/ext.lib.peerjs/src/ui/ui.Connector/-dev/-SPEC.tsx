import { Dev, type t, LabelItem } from '../../../test.ui';
import { Connector } from '..';
import { SampleList } from './-Sample.List';
import { Info } from '../../ui.Info';

type T = { props: t.RootProps };
const initial: T = { props: {} };
const name = Connector.displayName ?? '';

export default Dev.describe(name, (e) => {
  const State = LabelItem.Stateful.State;
  const TestState = {
    list: State.list(),
    items: [] as t.LabelItemState[],
    init: {
      item() {
        const initial = {}; // TEMP 🐷
        return State.item(initial);
      },
      items() {
        // TestState.items = Array.from({ length }).map(() => TestState.init.item());
        // TestState.items.unshift(Connector.Model.self());

        TestState.items = [
          //
          Connector.Model.self(),
          Connector.Model.remote(),
        ];
      },
    } as const,
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {});
    TestState.init.items();

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size([330, null])
      .display('grid')
      .render<T>((e) => {
        const length = TestState.items.length;
        const elements = Array.from({ length }).map((_, i) => {
          return (
            <LabelItem.Stateful
              key={`item.${i}`}
              index={i}
              total={length}
              list={TestState.list}
              item={TestState.items[i]}
              // debug={true}
              onChange={(e) => {
                console.info(`⚡️ onChange[${i}]`, e);
              }}
            />
          );
        });

        return <SampleList items={TestState.items} elements={elements} list={TestState.list} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.TODO();

    dev.hr(5, 20);

    dev.row((e) => <Info fields={['Module']} />);
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

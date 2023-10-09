import { Dev, type t, LabelItem } from '../../../test.ui';
import { Connector } from '..';
import { SampleList } from './-Sample.List';
import { Info } from '../../ui.Info';

type T = { props: t.ConnectorProps };
const initial: T = { props: {} };
const name = Connector.displayName ?? '';

export default Dev.describe(name, (e) => {
  const State = LabelItem.Stateful.State;
  const TestState = {
    list: State.list(),
    items: [] as { state: t.LabelItemState; renderers: t.LabelItemRenderers }[],
    init: {
      items() {
        TestState.items = [];
        const { Self, Remote } = Connector.Model;

        type S = t.LabelItemState;
        type R = t.LabelItemRenderers;
        const push = (state: S, renderers: R) => TestState.items.push({ state, renderers });
        push(Self.state(), Self.renderers);
        push(Remote.state(), Remote.renderers);
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
              item={TestState.items[i].state}
              renderers={TestState.items[i].renderers}
              // debug={true}
              onChange={(e) => {
                console.info(`⚡️ onChange[${i}]`, e);
              }}
            />
          );
        });

        return (
          <SampleList
            items={TestState.items.map((m) => m.state)}
            elements={elements}
            list={TestState.list}
          />
        );
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

import { Dev, type t, LabelItemStateful } from '../../test.ui';
import { Root } from '.';
import { Sample } from './-SPEC.Sample';
import { SampleList } from './-SPEC.Sample.List';

type T = { props: t.RootProps };
const initial: T = { props: {} };
const name = Root.displayName ?? '';

export default Dev.describe(name, (e) => {
  const TestState = {
    list: LabelItemStateful.State.list(),
    items: [] as t.LabelItemState[],
    init: {
      item() {
        const initial = Sample.item();
        return LabelItemStateful.State.item(initial);
      },
      items(length: number = 0) {
        TestState.items = Array.from({ length }).map(() => TestState.init.item());
      },
    } as const,
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {});
    TestState.init.items(5);

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size([330, null])
      .display('grid')
      .render<T>((e) => {
        const length = TestState.items.length;
        const elements = Array.from({ length }).map((_, i) => {
          return (
            <LabelItemStateful
              key={`item.${i}`}
              list={TestState.list}
              item={TestState.items[i]}
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

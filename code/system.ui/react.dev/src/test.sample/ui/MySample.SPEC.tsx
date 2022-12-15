import { Color, css, Spec } from '../common';
import { MySample } from './MySample';

let _count = 0;

type T = { count: number; msg?: string };

export default Spec.describe('MySample', (e) => {
  e.it('init', async (e) => {
    _count++;
    const ctx = Spec.ctx(e);
    const instance = ctx.toObject().instance;

    const state = ctx.state<T>({ count: 0 });

    const el = (
      <MySample
        text={`MySample-${_count} | state.count: ${state.current.count}`}
        style={{ flex: 1 }}
        onClick={() => {
          // ctx.reset
          ctx.run({ reset: true }); // Re-run all.
          state.change((draft) => draft.count++);
        }}
      />
    );

    ctx.component
      .size(300, 140)

      // .size('fill')
      // .size('fill-x')
      // .size('fill-y')

      .display('flex')
      .backgroundColor(1)
      .render(el);
  });

  e.it('foo', async (e) => {
    const ctx = Spec.ctx(e);
    const instance = ctx.toObject().instance;

    const styles = {
      base: css({
        // backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
        border: `solid 1px ${Color.format(-0.3)}`,
        borderRadius: 5,
        padding: 20,
        margin: 5,
      }),
    };

    // const o = ctx.toObject();
    // console.log('o', o);
    // const { width, height } = o.component.size;

    const el = (
      <div
        {...styles.base}
        onClick={() => {
          //

          // console.log('e', e);

          console.log('e.id', e.id);
          console.log('ctx', ctx);

          const target = e.id;
          ctx.run({ only: target });
          // DevBus.withEvents(instance, (events) => {
          //   events.run.fire();
          // });
        }}
      >
        {`Hello Foo!`}
      </div>
    );

    if (ctx.initial) {
      ctx.debug.TEMP(el);
    }
  });
});

import { Color, css, Spec } from '../common';
import { MySample } from './MySample';
import { Dev } from '../../Dev.mjs';

let _count = 0;

type T = { count: number; msg?: string };

export default Spec.describe('MySample', (e) => {
  e.it('init', async (e) => {
    _count++;
    const ctx = Spec.ctx(e);
    const instance = ctx.toObject().instance;

    const state = await ctx.state<T>({ count: 0 });
    const text = `MySample-${_count} | state.count: ${state.current.count}`;

    const el = (
      <MySample
        style={{ flex: 1 }}
        text={text}
        state={state.current}
        onClick={() => {
          // ctx.reset
          ctx.component.backgroundColor(-0.3);
          // ctx.run({ reset: true }); // Re-run all.
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
        onClick={async () => {
          console.log('-------------------------------------------');
          console.log('e.id', e.id);
          console.log('ctx', ctx);

          const state = await ctx.state<T>({ count: 0 });
          console.log('before', state.current);

          await state.change((draft) => draft.count++);

          // ctx.run({ only: e.id });
          Dev.Bus.withEvents(instance, async (events) => {
            //
            const info = await events.info.get();
            console.log('info', info);
            console.log('info.state', info.state);
            console.log('state.current', state.current);
          });
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

import { t, Color, css, Spec } from '../common';
import { MySample } from './MySample';
import { SampleDevTools } from '../tools';

let _count = 0;

type T = { count: number; msg?: string };

export default Spec.describe('MySample', (e) => {
  e.it('init', async (e) => {
    _count++;
    const ctx = Spec.ctx(e);

    const state = await ctx.state<T>({ count: 0 });

    ctx.component
      .size(300, 140)

      // .size('fill')
      // .size('fill-x')
      // .size('fill-y')

      .display('flex')
      .backgroundColor(1)
      .render<t.JsonMap>((e) => {
        const text = `MySample-${_count}`;
        return (
          <MySample
            style={{ flex: 1 }}
            text={text}
            state={e.state}
            onClick={() => {
              // ctx.reset
              ctx.component.backgroundColor(-0.3);
              // ctx.run({ reset: true }); // Re-run all.
              state.change((draft) => draft.count++);
            }}
          />
        );
      });
  });

  e.it('foo', async (e) => {
    const ctx = Spec.ctx(e);
    const state = await ctx.state<T>({ count: 0 });
    if (!ctx.initial) return;

    const styles = {
      base: css({
        border: `solid 1px ${Color.format(-0.3)}`,
        borderRadius: 5,
        padding: 20,
        margin: 5,
      }),
    };

    ctx.debug.render(() => {
      return (
        <div {...styles.base} onClick={() => state.change((draft) => draft.count++)}>
          {`Increment Count!`}
        </div>
      );
    });
  });

  e.it('rerun (all, reset)', async (e) => {
    const ctx = Spec.ctx(e);
    if (ctx.initial) {
      ctx.debug.render(() => {
        return <div onClick={() => ctx.run({ reset: true })}>Rerun</div>;
      });
    }
  });

  e.it('SampleDevTools', async (e) => {
    const m = SampleDevTools.button(e);

    console.log('m', m);
  });
});

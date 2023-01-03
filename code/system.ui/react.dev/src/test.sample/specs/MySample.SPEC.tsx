import { t, Color, css, Spec } from '../common';
import { MySample } from './MySample';
import { DevToolsSample } from '../sample.DevTools';
import { DevBus } from '../../logic.Bus';

let _renderCount = 0;

type T = { count: number; msg?: string };

export default Spec.describe('MySample', (e) => {
  e.it('init', async (e) => {
    _renderCount++;
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
        const text = `MySample-${_renderCount}`;
        return (
          <MySample
            style={{ flex: 1 }}
            text={text}
            state={e.state}
            onClick={() => {
              ctx.component.backgroundColor(-0.3);
              // ctx.run({ reset: true }); // Re-run all.
              state.change((draft) => draft.count++);
            }}
          />
        );
      });
  });

  e.it('increment count', async (e) => {
    const ctx = Spec.ctx(e);
    const state = await ctx.state<T>({ count: 0 });
    if (!ctx.is.initial) return;

    const styles = {
      base: css({
        border: `solid 1px ${Color.format(-0.3)}`,
        borderRadius: 5,
        padding: 10,
        margin: 5,
      }),
    };

    const onClick = () => {
      state.change((draft) => draft.count++);
    };

    ctx.debug.render(() => {
      return (
        <div {...styles.base} onClick={onClick}>
          {e.description}
        </div>
      );
    });
  });

  e.it('rerun (reset)', (e) =>
    Spec.once(e, (ctx) => {
      ctx.debug.render(() => {
        return <div onClick={() => ctx.run({ reset: true })}>{e.description}</div>;
      });
    }),
  );

  e.it('rerun', (e) =>
    Spec.once(e, (ctx) => {
      ctx.debug.render(() => {
        return <div onClick={() => ctx.run({})}>{`Rerun`}</div>;
      });
    }),
  );

  e.it('SampleDevTools', async (e) => {
    const ctx = await DevToolsSample.button(e, (e) => {
      console.log('Inside Spec - BUTTON', e);
      e.onClick(() => {});
    });

    console.log('-------------------------------------------');
    console.log('button', ctx);
  });

  e.it('info', async (e) => {
    Spec.once(e, (ctx) => {
      ctx.debug.render(() => {
        const onClick = () => {
          DevBus.withEvents(ctx, async (events) => {
            const info = await events.info.get();
            console.log('info', info);
            console.log('render.props?.debug', info.render.props?.debug.main);
          });
        };
        return <div onClick={onClick}>Get Info</div>;
      });
    });
  });

  e.it('redraw: component', async (e) => {
    Spec.once(e, (ctx) => {
      ctx.debug.render(() => {
        const onClick = () => DevBus.withEvents(ctx, (events) => events.redraw.component());
        return <div onClick={onClick}>{e.description}</div>;
      });
    });
  });
});

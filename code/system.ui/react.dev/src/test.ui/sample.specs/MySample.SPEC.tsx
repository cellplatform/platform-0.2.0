import { t, Color, css, Spec } from '../common';
import { MySample } from './MySample';
import { DevTools } from '../sample.DevTools';
import { DevBus } from '../../logic.Bus';

let _renderCount = 0;

const initial = { count: 0 };
type T = typeof initial;

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

              state.change((draft) => draft.count++);
            }}
          />
        );
      });
  });

  e.it('debug panel', async (e) => {
    const ctx = Spec.ctx(e);
    const debug = ctx.debug;
    const state = await ctx.state<T>(initial);
    if (!ctx.is.initial) return;

    debug.row(() => <DebugComponentSample />);

    //
  });

  e.it('increment count', async (e) => {
    const ctx = Spec.ctx(e);
    if (!ctx.is.initial) return;

    const state = await ctx.state<T>({ count: 0 });

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

    ctx.debug.row(() => {
      return (
        <div {...styles.base} onClick={onClick}>
          {e.description}
        </div>
      );
    });
  });

  e.it('rerun', (e) =>
    Spec.once(e, (ctx) => {
      const debug = ctx.debug;
      debug.row(() => <div onClick={() => ctx.run({ reset: true })}>{'Rerun (reset)'}</div>);
      debug.row(() => <div onClick={() => ctx.run({})}>{`Rerun`}</div>);
      debug.row(() => <Hr />);
    }),
  );

  e.it('SampleDevTools', async (e) => {
    const dev = DevTools.init(e);

    const ctx = await dev.button((e) => {
      console.log('Inside Spec - BUTTON', e);
      e.label('Hello').onClick(() => {});
    });

    console.log('-------------------------------------------');
    console.log('button', ctx);
  });

  e.it('info', (e) =>
    Spec.once(e, (ctx) => {
      ctx.debug.row(() => {
        const onClick = () => {
          DevBus.withEvents(ctx, async (events) => {
            const info = await events.info.get();
            console.log('info', info);
            console.log('render.props?.debug', info.render.props?.debug.main);
          });
        };
        return <div onClick={onClick}>Get Info</div>;
      });
    }),
  );

  e.it('redraw: component', (e) =>
    Spec.once(e, (ctx) => {
      ctx.debug.row(() => {
        const onClick = () => DevBus.withEvents(ctx, (events) => events.redraw.component());
        return <div onClick={onClick}>{e.description}</div>;
      });
    }),
  );
});

/**
 * Helpers
 */

const Hr = () => {
  const styles = {
    base: css({
      border: 'none',
      borderTop: `solid 1px ${Color.format(-0.1)}`,
      MarginY: 10,
    }),
  };
  return <div {...styles.base} />;
};

const DebugComponentSample = () => {
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      // border: `solid 1px ${Color.format(-0.1)}`,
    }),
  };
  return <div {...styles.base}>Component</div>;
};

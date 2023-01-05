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
    const dev = DevTools.init(e);
    const ctx = Spec.ctx(e);
    const debug = ctx.debug;
    const state = await ctx.state<T>(initial);
    const events = DevBus.events(e);

    if (!ctx.is.initial) return;

    debug.row(<DebugComponentSample />);
    dev.hr();

    dev.button((btn) => btn.label('rerun').onClick((e) => ctx.run()));
    dev.button((btn) => btn.label('rerun (reset)').onClick((e) => ctx.run({ reset: true })));
    dev.hr();

    dev.button((btn) => {
      let _count = 0;
      btn.label('my button').onClick((e) => {
        _count++;
        e.label(`my button-${_count}`);
      });
    });
    dev.hr();

    debug.row(<div>State</div>);
    dev.button((btn) => btn.label('increment').onClick((e) => state.change((d) => d.count++)));
    dev.button((btn) => btn.label('decrement').onClick((e) => state.change((d) => d.count--)));
    dev.hr();

    dev.button((btn) => {
      let _count = 0;
      btn.label('get info').onClick(async (e) => {
        _count++;
        const info = await events.info.get();
        console.info('info', info);
        e.label(`get info-${_count}`);
      });
    });

    dev.button((btn) => {
      btn.label('redraw: component').onClick((e) => events.redraw.component());
    });
  });
});

/**
 * Helpers
 */

const DebugComponentSample = () => {
  const styles = {
    base: css({
      padding: 4,
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
  };
  return <div {...styles.base}>Plain Component</div>;
};

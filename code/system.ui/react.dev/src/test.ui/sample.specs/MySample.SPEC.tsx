import { DevBus } from '../../logic.Bus';
import { COLORS, Color, css, Spec, t } from '../common';
import { DevTools } from '../sample.DevTools';
import { MySample } from './MySample';

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
      .display('flex')
      .backgroundColor('rgba(255, 0, 0, 0.1)' /* RED */)
      .render<t.JsonMap>((e) => {
        const text = `MySample-${_renderCount}`;
        return (
          <MySample
            style={{ flex: 1 }}
            text={text}
            state={e.state}
            onClick={() => {
              ctx.component.backgroundColor(1);
              state.change((draft) => draft.count++);
            }}
          />
        );
      });
  });

  e.it('debug panel', async (e) => {
    const ctx = Spec.ctx(e);
    if (!ctx.is.initial) return;

    const dev = DevTools.init(e);
    const debug = ctx.debug;
    const state = await ctx.state<T>(initial);
    const events = DevBus.events(ctx);

    debug.header.padding(0).render(<ComponentSample title={'header'} />);
    debug.footer.render(<ComponentSample title={'footer'} />).border(-0.15);

    debug.row(<ComponentSample />);
    dev.hr();

    dev
      .button((btn) => {
        let _count = 0;
        btn.label('rename (self)').onClick((e) => {
          _count++;
          e.label(`renamed-${_count}`);
        });
      })
      .hr();

    dev
      .button((btn) => btn.label('run specs').onClick((e) => ctx.run()))
      .button((btn) => btn.label('run specs (reset)').onClick((e) => ctx.run({ reset: true })))
      .hr();

    debug.row(<div>State</div>);
    dev
      .button((btn) => btn.label('increment (+)').onClick((e) => state.change((d) => d.count++)))
      .button((btn) => btn.label('decrement (-)').onClick((e) => state.change((d) => d.count--)))
      .hr();

    debug.row(<div>Harness</div>);
    dev.button((btn) => {
      let _count = 0;
      btn.label('get info').onClick(async (e) => {
        _count++;
        const info = await events.info.get();
        console.group('🌳 info');
        console.info('info', info);
        console.info('info.render.props:', info.render.props);
        console.info('info.render.props.debug:', info.render.props?.debug);
        e.label(`get info-${_count}`);
        console.groupEnd();
      });
    });

    dev.button((btn) => {
      btn.label('redraw: component').onClick((e) => events.redraw.component());
    });

    dev
      .hr()
      .button((btn) => btn.label('size: 300, 140').onClick((e) => e.ctx.component.size(300, 140)))
      .button((btn) => btn.label('size: fill').onClick((e) => e.ctx.component.size('fill')))
      .button((btn) => btn.label('size: fill-x').onClick((e) => e.ctx.component.size('fill-x')))
      .button((btn) => btn.label('size: fill-y').onClick((e) => e.ctx.component.size('fill-y')))
      .hr();

    debug.row(<div>Host</div>);
    dev.button((btn) =>
      btn.label('theme: light').onClick((e) => ctx.host.backgroundColor(null).gridColor(null)),
    );
    dev
      .button((btn) =>
        btn
          .label('theme: dark')
          .onClick((e) => ctx.host.backgroundColor(COLORS.DARK).gridColor(0.1)),
      )
      .hr();

    debug.row(<div>Debug Panel</div>);
    dev
      .button((btn) => btn.label('scroll: true').onClick((e) => ctx.debug.scroll(true)))
      .button((btn) => btn.label('scroll: false').onClick((e) => ctx.debug.scroll(false)))
      .button((btn) => btn.label('padding: 0').onClick((e) => ctx.debug.padding(0)))
      .button((btn) => btn.label('padding: [default]').onClick((e) => ctx.debug.padding(null)));
  });
});

/**
 * Helpers
 */

type P = { title?: string };
const ComponentSample = (props: P = {}) => {
  const { title = 'Plain Component' } = props;
  const styles = {
    base: css({
      padding: 7,
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
    inner: css({
      Padding: [5, 10],
      border: `dashed 1px ${Color.format(-0.25)}`,
      borderRadius: 7,
    }),
  };
  return (
    <div {...styles.base}>
      <div {...styles.inner}>{title}</div>
    </div>
  );
};

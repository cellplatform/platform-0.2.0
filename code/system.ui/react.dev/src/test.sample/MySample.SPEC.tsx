import { Color, css } from '../common';
import { Spec } from '../Spec';
import { MySample } from './MySample';
import { DevBus } from '../ui.Bus';

let _count = 0;

export default Spec.describe('MySample', (e) => {
  e.it('init', async (e) => {
    _count++;
    const ctx = Spec.ctx(e);
    const instance = ctx.toObject().instance;

    const el = (
      <MySample
        text={`MySample-${_count}`}
        style={{ flex: 1 }}
        onClick={() => {
          ctx.run(); // Re-run all.
        }}
      />
    );

    ctx.component
      //
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

          ctx.run(e.id);
          // DevBus.withEvents(instance, (events) => {
          //   events.run.fire();
          // });
        }}
      >
        {`Hello Foo!`}
      </div>
    );
    ctx.debug.TEMP(el);
  });
});

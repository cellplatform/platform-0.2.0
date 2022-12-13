import { Color, css } from '../common';
import { Spec } from '../Spec';
import { MySample } from './MySample';
import { DevBus } from '../ui.Bus';

let _count = 0;

export default Spec.describe('MySample', (e) => {
  e.it('init', async (e) => {
    _count++;
    const ctx = Spec.ctx(e);

    // console.group('🌳 init');
    // console.log('e', e);
    // console.log('e.ctx', e.ctx);
    // console.log('ctx.toObject()', ctx.toObject());
    // console.groupEnd();

    // console.log('ctx', ctx);

    const el = (
      <MySample
        text={`MySample-${_count}`}
        style={{ flex: 1 }}
        onClick={() => {
          // ctx.component.size(50, 500);
          // console.log('ctx.toObject()', ctx.toObject());

          // const events = setInfo(e.info)
          // console.log('ctx', ctx);
          // console.log('e', e);
          // console.log('e.ctx.toObject()', ctx.toObject());

          const instance = ctx.toObject().instance;
          const events = DevBus.Events({ instance });
          events.run.fire();
          events.dispose();
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

    const styles = {
      base: css({
        // backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
        border: `solid 1px ${Color.format(-0.3)}`,
        borderRadius: 12,
        padding: 20,
        margin: 5,
      }),
    };

    // const o = ctx.toObject();
    // console.log('o', o);
    // const { width, height } = o.component.size;

    const el = <div {...styles.base}>from foo: {e.id}</div>;
    ctx.debug.TEMP(el);
  });
});

import { css, Test } from '../common';
import { Spec } from '../Spec';
import { MySample } from './MySample';

let _count = 0;

export default Test.describe('MySample', (e) => {
  e.it('init', async (e) => {
    _count++;
    const ctx = Spec.ctx(e);

    console.group('🌳 init');
    console.log('e', e);
    console.log('e.ctx', e.ctx);
    console.log('ctx.toObject()', ctx.toObject());
    console.groupEnd();

    const el = (
      <MySample
        text={`MySample-${_count}`}
        style={{ flex: 1 }}
        onClick={() => {
          // ctx.component.size(50, 500);
          // console.log('ctx.toObject()', ctx.toObject());

          ctx.rerun();
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

    // ctx.debug.
  });

  e.it('foo', async (e) => {
    const ctx = Spec.ctx(e);

    console.log('it.foo', ctx.toObject());

    const el = <div>it-foo: {e.id}</div>;
    ctx.debug.TEMP(el);
  });
});

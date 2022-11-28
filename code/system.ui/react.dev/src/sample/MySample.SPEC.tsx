import { css, Test } from '../common';
import { Spec } from '../Spec';
import { MySample } from './MySample';

let _count = 0;

export default Test.describe('MySample', (e) => {
  e.it('init', async (e) => {
    _count++;

    console.group('🌳 within spec');
    console.log('e', e);
    console.log('e.ctx', e.ctx);
    console.groupEnd();

    const ctx = Spec.ctx(e);

    const el = (
      <MySample
        text={`MySample-${_count}`}
        style={{ flex: 1 }}
        onClick={() => {
          ctx.rerun();
        }}
      />
    );

    ctx
      //
      .size(300, 140)
      // .size('fill')
      // .size('fill-x')
      // .size('fill-y')

      .display('flex')
      .backgroundColor(1)
      .render(el);
  });
});

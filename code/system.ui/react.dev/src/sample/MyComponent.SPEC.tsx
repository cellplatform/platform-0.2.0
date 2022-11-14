import { css, Test } from '../common';
import { Spec } from '../Spec';

export default Test.describe('MyComponent', (e) => {
  console.log('describe', e);

  e.it('init', async (e) => {
    console.group('🌳 within spec');
    console.log('e', e);
    console.log('e.ctx', e.ctx);
    console.groupEnd();

    const ctx = Spec.ctx(e);

    const styles = {
      base: css({ flex: 1 }),
    };

    const el = <div {...styles.base}>Rendered from spec 🌳</div>;
    ctx
      //
      .render(el)
      .size(300, 140)
      // .size('fill')
      .display('flex')
      .backgroundColor(1);
  });
});

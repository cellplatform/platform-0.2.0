import { Spec } from '../../test.ui';
import { Root } from '.';

export default Spec.describe('Root', (e) => {
  e.it('init', async (e) => {
    const ctx = Spec.ctx(e);
    ctx.component
      .size('fill')
      .display('flex')
      .backgroundColor(1)
      .render(() => {
        return <Root style={{ flex: 1 }} />;
      });
  });
});

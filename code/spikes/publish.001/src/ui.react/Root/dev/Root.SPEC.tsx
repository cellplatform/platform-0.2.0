import { Spec } from '../../../test.ui';
import { Root } from '../index.mjs';

export default Spec.describe('Root', (e) => {
  e.it('init', async (e) => {
    const ctx = Spec.ctx(e);

    const el = <Root />;
    ctx.render(el).size('fill');
  });
});

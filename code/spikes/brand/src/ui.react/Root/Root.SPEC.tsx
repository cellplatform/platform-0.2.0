import { Spec } from '../../ui.test';
import { Root } from '.';

export default Spec.describe('Root', (e) => {
  e.it('init', async (e) => {
    const ctx = Spec.ctx(e);
    const el = <Root />;
    ctx.size('fill').render(el);
  });
});

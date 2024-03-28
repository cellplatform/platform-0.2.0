import { Spec } from '../../test.ui';
import { BrandLayout } from '.';

export default Spec.describe('BrandLayout', (e) => {
  e.it('init', async (e) => {
    const ctx = Spec.ctx(e);
    ctx.subject.size('fill').render(() => <BrandLayout />);
  });
});

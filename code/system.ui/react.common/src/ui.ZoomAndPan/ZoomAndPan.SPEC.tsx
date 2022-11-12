import { Spec } from '../test.ui';
import { ZoomAndPan } from '.';

export default Spec.describe('ZoomAndPan', (e) => {
  e.it('init', async (e) => {
    const ctx = Spec.ctx(e);
    const el = <ZoomAndPan />;
    ctx.render(el);
  });
});

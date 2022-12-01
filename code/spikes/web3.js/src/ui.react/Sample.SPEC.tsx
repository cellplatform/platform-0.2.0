import { Spec } from '../test.ui';
import { Sample } from './Sample';

export default Spec.describe('Sample', (e) => {
  e.it('init', async (e) => {
    //
    const ctx = Spec.ctx(e);

    const el = <Sample />;
    ctx.render(el).size('fill').display('flex');
  });
});

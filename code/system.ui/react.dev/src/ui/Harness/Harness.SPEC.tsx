import { Spec } from '../../test.ui';
import { Harness } from '.';

export default Spec.describe('Harness', (e) => {
  e.it('init', async (e) => {
    const ctx = Spec.ctx(e);
    const el = <Harness style={{ flex: 1 }} />;
    ctx.component.size('fill').display('flex').render(el);
  });
});

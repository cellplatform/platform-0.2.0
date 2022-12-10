import { Spec } from '../../test.ui';
import { Root } from '.';

export default Spec.describe('Root', (e) => {
  e.it('init', async (e) => {
    const ctx = Spec.ctx(e);
    const el = <Root style={{ flex: 1 }} />;
    ctx.size('fill').display('flex').render(el);
  });
});

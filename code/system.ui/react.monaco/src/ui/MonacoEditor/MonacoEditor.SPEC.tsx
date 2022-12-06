import { Spec } from '../../test.ui';
import { MonacoEditor } from '.';

export default Spec.describe('MonacoEditor', (e) => {
  e.it('init', async (e) => {
    const ctx = Spec.ctx(e);

    const el = <MonacoEditor style={{ flex: 1 }} />;

    ctx.size('fill').display('flex').render(el);
  });
});

import { Spec } from '../../test.ui';
import { VideoDiagram } from '.';

export default Spec.describe('VideoDiagram', (e) => {
  e.it('init', async (e) => {
    const ctx = Spec.ctx(e);

    const el = <VideoDiagram style={{ Absolute: 0 }} />;

    ctx.size('fill').render(el);
  });
});

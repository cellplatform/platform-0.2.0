import { VideoDiagram } from '.';
import { Spec } from '../../test.ui';

export default Spec.describe('VideoDiagram', (e) => {
  e.it('init', async (e) => {
    const { env } = await import('../Root.env'); // NB: Initiate the global environment.
    const ctx = Spec.ctx(e);

    ctx.subject
      .size('fill')
      .render(() => <VideoDiagram instance={env.instance} style={{ Absolute: 0 }} />);
  });
});

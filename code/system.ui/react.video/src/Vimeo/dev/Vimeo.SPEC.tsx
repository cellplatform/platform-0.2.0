import { Spec } from '../../test.spec';

export default Spec.describe('Vimeo Player', (e) => {
  /**
   * Initialize
   */
  e.it('init', async (e) => {
    const ctx = Spec.ctx(e);
    const el = <div>Hello, World!</div>;
    ctx.render(el);
  });
});

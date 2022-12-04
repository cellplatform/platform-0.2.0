import { Spec } from '../../ui.test';

export default Spec.describe('Root', (e) => {
  e.it('init', async (e) => {
    const ctx = Spec.ctx(e);

    const el = <div>Hello</div>;

    ctx.render(el);
  });
});

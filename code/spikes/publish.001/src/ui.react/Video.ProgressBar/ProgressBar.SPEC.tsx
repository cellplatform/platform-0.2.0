import { Spec, expect } from '../../test.ui';

export default Spec.describe('Video.ProbressBar', (e) => {
  e.it('init', async (e) => {
    const ctx = Spec.ctx(e);
    const el = <div>{`Hello 🐷`}</div>;
    ctx.backgroundColor(1).render(el);
  });
});

import { Spec } from '../../../test.ui';
import { Root } from '../index.mjs';

export default Spec.describe('Root (DevEnv)', (e) => {
  e.it('init', async (e) => {
    const ctx = Spec.ctx(e);
    const el = <Root showEditor={true} />;
    ctx.component.render(el).size('fill');
  });
});

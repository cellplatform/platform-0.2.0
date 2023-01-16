import { Spec } from '../../../test.ui';
import { Root } from '../index.mjs';

export default Spec.describe('Root (DevEnv)', (e) => {
  e.it('init', async (e) => {
    const ctx = Spec.ctx(e);
    ctx.subject.size('fill').render(() => <Root showEditor={true} />);
  });
});

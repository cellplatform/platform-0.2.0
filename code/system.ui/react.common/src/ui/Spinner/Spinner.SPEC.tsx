import { Spec } from '../../test.ui';
import { Spinner } from '.';

export default Spec.describe('Spinner', (e) => {
  e.it('init', async (e) => {
    const ctx = Spec.ctx(e);
    ctx.component.render(() => {
      return <Spinner size={32} />;
    });
  });
});

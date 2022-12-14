import { Dev } from '../../test.ui';
import { Spinner } from '.';

export default Dev.describe('Spinner', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    ctx.component.render(() => {
      return <Spinner size={32} />;
    });
  });
});

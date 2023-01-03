import { Spec } from '../../test.ui';

export default Spec.describe('ui.dev.DevTools', (e) => {
  e.it('init', async (e) => {
    const ctx = Spec.ctx(e);
    ctx.component.render(() => <div>DevTools</div>);
  });
});

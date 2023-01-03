import { Spec } from '../../test.ui';

export default Spec.describe('DevTools', (e) => {
  e.it('init', async (e) => {
    const ctx = Spec.ctx(e);
    ctx.component
      .display('grid')
      .size(250, undefined)
      .render(() => <div>Dev Tools 🐷</div>);
  });
});

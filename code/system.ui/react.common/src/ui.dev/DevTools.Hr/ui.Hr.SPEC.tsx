import { Spec } from '../../test.ui';
import { Dev } from '..';

export default Spec.describe('Button', (e) => {
  e.it('debug panel', async (e) => {
    const ctx = Spec.ctx(e);
    ctx.component
      .display('grid')
      .size(250, undefined)
      .render(() => <div>Hello</div>);
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools(e);
    dev.hr();
  });
});

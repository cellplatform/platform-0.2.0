import { Dev } from '..';
import { Hr } from '.';

export default Dev.describe('Hr', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    ctx.component.size('fill-x').render(() => <Hr />);
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools(e);
    dev.hr();
  });
});

import { Dev } from '..';
import { Todo } from '.';

export default Dev.describe('Todo', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    ctx.component.size(300, null).render(() => <Todo style={{ margin: 0 }} />);
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools(e);
    dev.title('TODO (Placeholder)').hr().TODO('Do this thing').TODO();
  });
});

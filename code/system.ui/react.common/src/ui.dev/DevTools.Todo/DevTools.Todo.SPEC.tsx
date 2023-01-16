import { Dev } from '..';
import { Todo } from '.';

export default Dev.describe('Todo', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    ctx.subject.size(300, null).render(() => <Todo style={{ margin: 0 }} />);
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools(e);
    dev
      //
      .title('TODO (Placeholder)')
      .hr()
      .TODO()
      .TODO('Do this single-line thing')
      .TODO(`Long single-line thing ${Dev.Lorem.toString()}`).TODO(`

      Multiline markdown comments:

      - one
      - two
      - three
    
    `);
  });
});

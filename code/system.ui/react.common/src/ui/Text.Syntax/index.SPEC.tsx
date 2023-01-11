import { Dev, expect } from '../../test.ui';
import { TextSyntax } from '.';

type T = { count: number };
const initial: T = { count: 0 };

export default Dev.describe('Test.syntax', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<T>(initial);
    ctx.component
      .display('grid')
      .backgroundColor(1)
      .size(250, null)
      .render<T>((e) => <TextSyntax text={'{ Hello }'} />);
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.footer.border(-0.1).render<T>((e) => <Dev.ObjectView name={'state'} data={e.state} />);

    dev.button('tmp', (e) => e.change((d) => d.count++));
  });
});

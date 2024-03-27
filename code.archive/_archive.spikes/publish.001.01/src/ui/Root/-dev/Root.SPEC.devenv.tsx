import { Dev } from '../../../test.ui';
import { Root, RootProps } from '..';

type T = { props: RootProps };
const initial: T = { props: {} };

export default Dev.describe('Root (DevEnv)', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    ctx.subject.size('fill').render(() => <Root showEditor={true} />);
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'info'} data={e.state} expand={3} />);

    dev.title('Root Entry (DevEnv)');
    dev.TODO();
  });
});

import { Dev } from '../../test.ui';
import { YouTube, YouTubeProps } from '.';

type T = { props: YouTubeProps };
const initial: T = { props: {} };

export default Dev.describe('YouTube', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<T>(initial);
    ctx.subject
      .display('grid')
      .backgroundColor(1)
      // .size(250, null)
      .render<T>((e) => {
        return <YouTube {...e.state.props} />;
      });
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'info'} data={e.state} expand={1} />);
  });
});

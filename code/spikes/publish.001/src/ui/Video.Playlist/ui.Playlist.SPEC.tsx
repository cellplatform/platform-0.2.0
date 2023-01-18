import { Dev } from '../../test.ui';

type T = { count: number };
const initial: T = { count: 0 };

export default Dev.describe('Video.Playlist', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<T>(initial);
    ctx.subject
      .display('grid')
      .backgroundColor(1)
      .size(250, null)
      .render<T>((e) => <div>{`🐷 Hello-${e.state.count}`}</div>);
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'info'} data={e.state} expand={3} />);

    dev.button('tmp', (e) => e.change((d) => d.count++));
  });
});

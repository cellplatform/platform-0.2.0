import { Dev, cuid } from '../../test.ui';
import { PeerId, PeerIdProps } from '.';

type T = { props: PeerIdProps };
const initial: T = { props: { peer: cuid() } };

export default Dev.describe('PeerId', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<T>(initial);
    ctx.subject
      .backgroundColor(1)
      .display('grid')
      .render<T>((e) => {
        return <PeerId {...e.state.props} />;
      });
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'spec'} data={e.state} expand={1} />);
  });
});

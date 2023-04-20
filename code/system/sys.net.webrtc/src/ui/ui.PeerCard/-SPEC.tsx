import { Dev } from '../../test.ui';
import { PeerCard, PeerCardProps } from '.';

type T = { props: PeerCardProps };
const initial: T = { props: {} };

export default Dev.describe('PeerCard', (e) => {
  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    ctx.subject
      .backgroundColor(1)
      .size([400, 320])
      .display('grid')
      .render<T>((e) => {
        return <PeerCard {...e.state.props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={'PeerCard'} data={data} expand={1} />;
    });
  });
});

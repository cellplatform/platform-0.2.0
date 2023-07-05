import { Dev, TestNetwork, type t } from '../../test.ui';
import { Connect } from '../ui.Connect';
import { DevMedia } from '../ui.Info/-dev/DEV.Media';

type T = { selectedPeer?: t.PeerId };
const initial: T = {};

export default Dev.describe('GroupVideo', async (e) => {
  const self = await TestNetwork.peer();

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    ctx.subject
      .backgroundColor(1)
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        return <DevMedia self={self} peerid={e.state.selectedPeer} />;
      });
  });

  e.it('ui:header', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.header
      .border(-0.1)
      .padding([0, 0, 20, 0])
      .render((e) => {
        return (
          <Connect.Stateful
            self={self}
            onChange={(e) => {
              state.change((d) => (d.selectedPeer = e.selected?.peer.id));
            }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={'GroupVideo'} data={data} expand={1} />;
    });
  });
});

import { Dev, TestNetwork } from '../../test.ui';
import { WebRtcInfo } from '../ui.Info';

type T = { count: number };
const initial: T = { count: 0 };

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
        return <div>{`🐷 GroupVideo-${e.state.count}`}</div>;
      });
  });

  e.it('ui:header', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.header
      .border(-0.1)
      .padding(0)
      .render((e) => {
        return (
          <WebRtcInfo
            fields={['Connect.Top', 'Group', 'Group.Peers', 'State.Shared']}
            data={{
              connect: { self },
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

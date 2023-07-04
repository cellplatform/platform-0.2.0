import { type t, Dev, TestNetwork } from '../../test.ui';
import { Connect } from '.';

type T = { data?: t.WebRtcInfoData };
const initial: T = {};

export default Dev.describe('Connect', async (e) => {
  const self = await TestNetwork.peer();

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    ctx.subject
      .backgroundColor(1)
      .size([350, null])
      .display('grid')
      .render<T>((e) => {
        return (
          <Connect.Stateful
            self={self}
            edge={'Bottom'}
            onChange={(e) => state.change((d) => (d.data = e.data))}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.TODO();
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={'Connect'} data={data} expand={1} />;
    });
  });
});

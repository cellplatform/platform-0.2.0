import { Dev, TestNetwork, t } from '../../../test.ui';
import { ConnectInput } from '..';

type T = { props: t.ConnectInputProps };
const initial: T = { props: {} };

export default Dev.describe('ConnectInput', async (e) => {
  const self = await TestNetwork.peer();

  const Util = {
    props: (state: T) => {
      return { ...state.props, self };
    },
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    self.connections$.subscribe(() => ctx.redraw());

    ctx.subject
      .backgroundColor(1)
      .size([400, null])
      .display('grid')
      .render<T>((e) => {
        const props = Util.props(e.state);
        return <ConnectInput {...props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.section('Props', (dev) => {
      dev.boolean((btn) =>
        btn
          .label('showPeer')
          // TODO 🐷
          // .value((e) => SharedProps.current.showPeer)
          .onClick((e) => {
            // SharedProps.change((d) => (local.showPeer = Dev.toggle(d, 'showPeer')));
          }),
      );

      dev.boolean((btn) =>
        btn
          .label('showConnect')
          // TODO 🐷
          // .value((e) => SharedProps.current.showConnect ?? PeerCard.DEFAULTS.showConnect)
          .onClick((e) => {
            // SharedProps.change((d) => (local.showConnect = Dev.toggle(d, 'showConnect')));
          }),
      );
    });

    dev.hr(-1, 5);
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const total = self?.connections.length ?? 0;
      const data = {
        [`WebRtc.Peer[${total}]`]: self,
        props: e.state.props,
      };
      return <Dev.Object name={'Dev.ConnectInput'} data={data} expand={1} />;
    });
  });
});

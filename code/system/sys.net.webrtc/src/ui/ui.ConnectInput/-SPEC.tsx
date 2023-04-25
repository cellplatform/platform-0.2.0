import { WebRtc, Dev, TestNetwork, t } from '../../test.ui';
import { ConnectInput } from '.';

type T = { props: t.ConnectInputProps };
const initial: T = {
  props: {
    showPeer: ConnectInput.DEFAULTS.showPeer,
    showConnect: ConnectInput.DEFAULTS.showConnect,
    spinning: ConnectInput.DEFAULTS.spinning,
  },
};

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

    dev.row((e) => {
      return (
        <WebRtc.InfoCard
          fields={['Module.Verify', 'Module', 'Self']}
          data={{ self: { peer: self } }}
        />
      );
    });

    dev.hr(5, 20);

    dev.section('Properties', (dev) => {
      dev.boolean((btn) =>
        btn
          .label('showPeer')
          .value((e) => Boolean(e.state.props.showPeer))
          .onClick((e) => {
            e.change((d) => Dev.toggle(d.props, 'showPeer'));
          }),
      );

      dev.boolean((btn) =>
        btn
          .label('showConnect')
          .value((e) => Boolean(e.state.props.showConnect))
          .onClick((e) => {
            e.change((d) => Dev.toggle(d.props, 'showConnect'));
          }),
      );

      dev.boolean((btn) =>
        btn
          .label('spinning')
          .value((e) => Boolean(e.state.props.spinning))
          .onClick((e) => {
            e.change((d) => Dev.toggle(d.props, 'spinning'));
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

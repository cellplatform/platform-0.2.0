import { t, Dev, TestNetwork, WebRtc } from '../../../test.ui';
import { PeerRow, PeerRowProps } from '../ui.PeerRow';

type T = {
  props: PeerRowProps;
};

export default Dev.describe('PeerRow', async (e) => {
  type LocalStore = { selected: boolean };
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.net.webrtc.PeerRow');
  const local = localstore.object({
    selected: true,
  });

  const create = async () => {
    const peer = await TestNetwork.peer();
    const controller = WebRtc.controller(peer);
    return { peer, controller };
  };

  const [self, remote] = await Promise.all([create(), create()]);

  const networkPeer = (args: { peer: t.Peer; controller: t.WebRtcController }) => {
    const { peer, controller } = args;
    const network = controller.state.current.network;
    return network.peers[peer.id];
  };

  const initial: T = {
    props: {
      self: self.peer,
      data: networkPeer(self),
    },
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    state.change((d) => {
      d.props.selected = local.selected;
    });

    ctx.subject
      .backgroundColor(1)
      .size([250, null])
      .display('grid')
      .render<T>((e) => {
        return <PeerRow {...e.state.props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.section('Peer', (dev) => {
      const button = (label: string, args: { peer: t.Peer; controller: t.WebRtcController }) => {
        dev.button((btn) =>
          btn
            .label(label)
            .right((e) => (e.state.props.data?.id === args.peer.id ? '← (current)' : ''))
            .onClick((e) => e.change((d) => (d.props.data = networkPeer(args)))),
        );
      };

      button('self (me)', self);
      button('remote', remote);
    });

    dev.hr(5, 20);

    dev.section('Properties', (dev) => {
      dev.boolean((btn) =>
        btn
          .label((e) => `selected`)
          .value((e) => Boolean(e.state.props.selected))
          .onClick((e) => e.change((d) => (local.selected = Dev.toggle(d.props, 'selected')))),
      );
    });

    dev.hr(5, 20);
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const total = (peer: t.Peer) => peer.connectionsByPeer.length ?? 0;
      const data = {
        [`Peer:Self(${total(self.peer)})`]: self,
        [`Peer:Remote(${total(remote.peer)})`]: remote,
        props: e.state.props,
      };

      return <Dev.Object name={'PeerRow'} data={data} expand={1} />;
    });
  });
});

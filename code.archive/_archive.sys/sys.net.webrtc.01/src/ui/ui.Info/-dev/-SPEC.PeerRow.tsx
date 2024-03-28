import { Dev, TestNetwork, WebRtc, type t } from './common';
import { PeerRow, PeerRowProps } from '../ui/PeerRow';

type NetworkProximity = 'Local' | 'Remote';
type T = {
  props: PeerRowProps;
  debug: { useNetwork: NetworkProximity };
};
const initial: T = {
  props: { peerid: 'p-foo', isOverParent: true },
  debug: { useNetwork: 'Local' },
};

export default Dev.describe('PeerRow', async (e) => {
  type LocalStore = T['debug'] & { isSelected: boolean; isSelf: boolean; useController: boolean };
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.net.webrtc.PeerRow');
  const local = localstore.object({
    isSelected: true,
    isSelf: true,
    useNetwork: 'Local',
    useController: true,
  });

  const create = async () => {
    const peer = await TestNetwork.peer();
    const controller = WebRtc.controller(peer);
    const client = controller.client();
    return { peer, controller, client };
  };

  const [self, remote] = await Promise.all([create(), create()]);

  const Util = {
    props(state: T): PeerRowProps {
      const { debug, props } = state;
      const network = debug.useNetwork === 'Local' ? self : remote;
      return {
        ...props,
        peerid: network.peer.id,
        client: network.client,
      };
    },
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    state.change((d) => {
      d.props.isSelected = local.isSelected;
      d.props.isSelf = local.isSelf;
      d.props.useController = local.useController;
      d.debug.useNetwork = local.useNetwork;
    });

    ctx.host.tracelineColor(-0.04);
    ctx.subject
      .backgroundColor(1)
      .size([250, null])
      .display('grid')
      .render<T>((e) => {
        const props = Util.props(e.state);
        return (
          <PeerRow
            {...props}
            onSelect={(e) => console.info('⚡️ onSelect:', e)}
            onCtrlClick={(e) => console.info('⚡️ onCtrlClick:', e)}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.section('Properties', (dev) => {
      dev.boolean((btn) =>
        btn
          .label((e) => 'useController')
          .value((e) => Boolean(e.state.props.useController))
          .onClick((e) =>
            e.change((d) => (local.useController = Dev.toggle(d.props, 'useController'))),
          ),
      );
      dev.hr(-1, 5);
      dev.boolean((btn) =>
        btn
          .label((e) => 'isSelected')
          .value((e) => Boolean(e.state.props.isSelected))
          .onClick((e) => e.change((d) => (local.isSelected = Dev.toggle(d.props, 'isSelected')))),
      );
      dev.boolean((btn) =>
        btn
          .label((e) => `isSelf ${e.state.props.isSelf ? ' ("me")' : ''}`)
          .enabled(false)
          .value((e) => Boolean(e.state.props.isSelf))
          .onClick((e) => e.change((d) => (local.isSelf = Dev.toggle(d.props, 'isSelf')))),
      );
    });

    dev.hr(5, 20);

    dev.section('Network', (dev) => {
      const useNetwork = (network: NetworkProximity) => {
        dev.button((btn) =>
          btn
            .label(`use ${network}`)
            .right((e) => (e.state.debug.useNetwork === network ? '← (current)' : ''))
            .onClick((e) => {
              e.change((d) => {
                d.debug.useNetwork = local.useNetwork = network;
                d.props.isSelf = local.isSelf = network === 'Local';
              });
            }),
        );
      };
      useNetwork('Local');
      useNetwork('Remote');
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const total = (peer: t.Peer) => peer.connectionsByPeer.length ?? 0;
      const data = {
        [`Peer:Self(${total(self.peer)})`]: self,
        [`Peer:Remote(${total(remote.peer)})`]: remote,
        props: Util.props(e.state),
      };

      return <Dev.Object name={'PeerRow'} data={data} expand={1} />;
    });
  });
});

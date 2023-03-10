import { PeerVideo, PeerVideoProps } from '.';
import { COLORS, Dev, t, TestNetwork, TestNetworkP2P, Time } from '../../test.ui';
import { PeerList } from '../ui.PeerList';

type T = {
  self?: t.Peer;
  remote?: t.Peer;
  props: PeerVideoProps;
  debug: { showBg: boolean };
};
const initial: T = {
  props: { showPeer: true, showConnect: true },
  debug: { showBg: true },
};

export default Dev.describe('PeerVideo', async (e) => {
  e.timeout(9999);

  type LocalStore = { muted: boolean; showBg: boolean; showPeer?: boolean; showConnect?: boolean };
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.net.webrtc.PeerVideo');
  const local = localstore.object({ muted: true, showBg: initial.debug.showBg });

  let network: TestNetworkP2P;

  e.it('init:ui', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.muted = local.muted;
      d.debug.showBg = local.showBg;
    });

    ctx.subject
      .display('grid')
      .size(400, null)
      .render<T>((e) => {
        const { showBg } = e.state.debug;
        return (
          <PeerVideo
            {...e.state.props}
            style={{ backgroundColor: showBg ? COLORS.WHITE : undefined }}
            onRemotePeerChanged={(e) => state.change((d) => (d.props.remotePeer = e.remote))}
            onConnectRequest={async (e) => {
              const self = network.peerA;
              state.change((d) => (d.props.spinning = true));
              await Promise.all([self.data(e.remote), self.media(e.remote, 'camera')]);
              state.change((d) => (d.props.spinning = false));
            }}
          />
        );
      });
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const data = {
        self: e.state.self,
      };
      return <Dev.Object name={'PeerVideo'} data={data} expand={1} />;
    });

    // Debug.
    dev.section((dev) => {
      dev.boolean((btn) =>
        btn
          .label('white background')
          .value((e) => e.state.debug.showBg)
          .onClick((e) => e.change((d) => (local.showBg = Dev.toggle(d.debug, 'showBg')))),
      );

      dev.hr(-1, 5);

      dev.boolean((btn) =>
        btn
          .label('show peer-id')
          .value((e) => e.state.props.showPeer ?? PeerVideo.DEFAULTS.showPeer)
          .onClick((e) => e.change((d) => (local.showBg = Dev.toggle(d.props, 'showPeer')))),
      );

      dev.boolean((btn) =>
        btn
          .label('show connect')
          .value((e) => e.state.props.showConnect ?? PeerVideo.DEFAULTS.showConnect)
          .onClick((e) => e.change((d) => (local.showBg = Dev.toggle(d.props, 'showConnect')))),
      );
    });

    dev.hr(5, 20);

    dev.section('Programmatic Peer Connection (Test)', (dev) => {
      dev.button((btn) =>
        btn
          .label('connect')
          .enabled((e) => (e.state.self?.connections.length ?? 0) === 0)
          .right((e) => {
            const self = e.state.self;
            if (!self) return '';
            return self.connections.length === 0 ? '←' : '';
          })
          .onClick(async (e) => {
            await e.change((d) => {
              d.props.spinning = true;
              d.props.remotePeer = network.peerB.id;
            });
            await network.connect();
            await e.change(async (d) => {
              await Time.wait(500); // NB: [HACK] Wait for media to be ready before hiding spinner.
              d.props.spinning = false;
            });
          }),
      );

      dev.button((btn) =>
        btn
          .label('disconnect')
          .enabled((e) => (e.state.self?.connections.length ?? 0) > 0)
          .right((e) => {
            const self = e.state.self;
            if (!self) return '';
            return self.connections.length > 0 ? '←' : '';
          })
          .onClick(async (e) => {
            network.peerA.connections.all.forEach((conn) => conn.dispose());
          }),
      );
    });

    dev.hr(5, [20, 50]);

    dev.row((e) => {
      const self = e.state.self;
      return self ? <PeerList self={self} style={{ MarginX: 35 }} /> : null;
    });
  });

  e.it('init:network', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    const update = async (d: T) => {
      d.self = network.peerA;
      d.remote = network.peerB;
      d.props.self = network.peerA;
    };

    network = await TestNetwork.init();
    await state.change((d) => update(d));
    network.peerA.connections$.subscribe(() => state.change((d) => update(d)));
  });
});

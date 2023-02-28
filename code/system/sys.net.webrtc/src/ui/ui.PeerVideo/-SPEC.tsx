import { PeerVideo, PeerVideoProps } from '.';
import { Dev, rx, t, TEST, WebRTC, TestNetwork, TestNetworkP2P, Time } from '../../test.ui';

type T = {
  props: PeerVideoProps;
  self?: t.Peer;
  remote?: t.Peer;
};
const initial: T = { props: {} };

export default Dev.describe('PeerVideo', async (e) => {
  e.timeout(9999);

  type LocalStore = { muted: boolean };
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.net.webrtc.PeerVideo');
  const local = localstore.object({ muted: true });

  let network: TestNetworkP2P;

  e.it('init:ui', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    await state.change((d) => (d.props.muted = local.muted));

    ctx.subject
      .backgroundColor(1)
      .display('grid')
      .size(400, null)
      .render<T>((e) => {
        return <PeerVideo {...e.state.props} />;
      });
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'spec.PeerVideo'} data={e.state} expand={1} />);

    dev.title('PeerVideo').hr();

    dev.button('connect', async (e) => {
      await e.change((d) => (d.props.spinning = true));
      await network.connect();
      await e.change(async (d) => {
        await Time.wait(500); // NB: [HACK] Wait for media to be ready before hiding spinner.
        d.props.spinning = false;
      });
    });

    dev.button('disconnect', (e) => {
      network.peerA.connections.all.forEach((conn) => conn.dispose());
    });
  });

  e.it('init:network', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    network = await TestNetwork.init();

    const update = async (d: T) => {
      d.self = network.peerA;
      d.remote = network.peerB;
      d.props.self = network.peerA;
    };
    await state.change((d) => update(d));
    network.peerA.connections$.subscribe(() => state.change((d) => update(d)));
  });
});

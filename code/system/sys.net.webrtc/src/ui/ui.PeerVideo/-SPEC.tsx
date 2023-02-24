import { PeerVideo, PeerVideoProps } from '.';
import { Dev, t, TEST, WebRTC } from '../../test.ui';

type T = { props: PeerVideoProps };
const initial: T = { props: {} };

export default Dev.describe('PeerVideo', (e) => {
  type LocalStore = { muted: boolean };
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.net.webrtc.PeerVideo');
  const local = localstore.object({ muted: true });

  const media = WebRTC.Media.singleton({});
  let self: t.Peer;

  e.it('init:webrtc', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    await state.change((d) => (d.props.muted = local.muted));

    /**
     * WebRTC (network)
     */
    const { getStream } = media;
    self = await WebRTC.peer({ signal: TEST.signal, getStream });
    await state.change((d) => (d.props.self = self));
    self.connections$.subscribe((e) => state.change((d) => (d.props.self = self)));
  });

  e.it('init:ui', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<T>(initial);
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
      .render<T>((e) => <Dev.Object name={'spec'} data={e.state} expand={1} />);

    dev.title('PeerVideo');
  });
});

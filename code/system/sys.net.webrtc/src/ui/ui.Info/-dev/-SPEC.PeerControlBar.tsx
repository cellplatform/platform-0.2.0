import { Dev, WebRtc, t } from '../../../test.ui';
import { PeerControlBar, PeerControlBarProps } from '../ui.PeerControlBar';

type T = {
  camera?: t.PeerGetMediaStreamRes;
  screen?: t.PeerGetMediaStreamRes;
  props: PeerControlBarProps;
};
const initial: T = {
  props: {},
};

export default Dev.describe('PeerControlBar', (e) => {
  const getStream = WebRtc.Media.singleton().getStream;

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    ctx.host.tracelineColor(-0.05);

    ctx.subject
      .backgroundColor(1)
      .size([null, null])
      .display('grid')

      .render<T>((e) => {
        const props = {
          ...e.state.props,
          // camera: e.state.camera?.media,
          // screen: e.state.screen?.media,
        };

        return <PeerControlBar {...props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.section('Media', (dev) => {
      dev.button('camera: start', async (e) => {
        const camera = await getStream('camera');
        e.change((d) => (d.camera = camera));
      });

      dev.button('camera: stop', async (e) => {
        e.state.current.camera?.done();
        e.change((d) => (d.camera = undefined));
      });

      dev.hr(-1, 5);

      dev.button('screen: start', async (e) => {
        const screen = await getStream('screen');
        e.change((d) => (d.screen = screen));
      });

      dev.button('screen: stop', async (e) => {
        e.state.current.screen?.done();
        e.change((d) => (d.screen = undefined));
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const data = { props: e.state.props };
      return <Dev.Object name={'ControlBar'} data={data} expand={1} />;
    });
  });
});

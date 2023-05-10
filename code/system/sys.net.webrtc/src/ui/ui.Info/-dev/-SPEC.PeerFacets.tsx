import { PropList, Dev, WebRtc, t } from '../../../test.ui';
import { PeerFacets, PeerFacetsProps } from '../ui.PeerFacets';

type T = {
  camera?: t.PeerGetMediaStreamRes;
  screen?: t.PeerGetMediaStreamRes;
  props: PeerFacetsProps;
};
const initial: T = { props: {} };

export default Dev.describe('PeerFacets', (e) => {
  const getStream = WebRtc.Media.singleton().getStream;

  type LocalStore = { disabled?: t.WebRtcInfoPeerFacet[] };
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.net.webrtc.Info.PeerFacets');
  const local = localstore.object({ disabled: undefined });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    state.change((d) => {
      d.props.disabled = local.disabled;
    });

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

        return <PeerFacets {...props} onClick={(e) => console.info(`⚡️ onClick:`, e)} />;
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

    dev.hr(5, 20);

    dev.section('Disabled', (dev) => {
      dev.row((e) => {
        const props = e.state.props;
        return (
          <PropList.FieldSelector
            style={{ Margin: [10, 40, 10, 30] }}
            all={PeerFacets.FIELDS}
            selected={props.disabled}
            showIndexes={false}
            onClick={(ev) => {
              const fields = ev.next as t.WebRtcInfoPeerFacet[];
              dev.change((d) => (d.props.disabled = fields));
              local.disabled = fields?.length === 0 ? undefined : fields;
            }}
          />
        );
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const data = { props: e.state.props };
      return <Dev.Object name={'PeerFacets'} data={data} expand={1} />;
    });
  });
});

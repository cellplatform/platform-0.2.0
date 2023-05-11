import { PropList, Dev, WebRtc, t, MediaStream } from '../../../test.ui';
import { PeerControls, PeerControlsProps } from '../ui.PeerControls';

type T = {
  camera?: t.PeerGetMediaStreamRes;
  screen?: t.PeerGetMediaStreamRes;
  props: PeerControlsProps;
};
const initial: T = { props: {} };

type LocalStore = {
  spinning?: t.WebRtcInfoPeerFacet[];
  off?: t.WebRtcInfoPeerFacet[];
  disabled?: t.WebRtcInfoPeerFacet[];
};

export default Dev.describe('PeerFacets', (e) => {
  const getStream = WebRtc.Media.singleton().getStream;

  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.net.webrtc.Info.PeerFacets');
  const local = localstore.object({
    spinning: undefined,
    off: undefined,
    disabled: undefined,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    state.change((d) => {
      d.props.disabled = local.disabled;
      d.props.spinning = local.spinning;
      d.props.off = local.off;
    });

    ctx.host.tracelineColor(-0.05);
    ctx.subject
      .backgroundColor(1)
      .size([null, null])
      .display('grid')

      .render<T>((e) => {
        const handleKindClick = async (args: { kind: t.WebRtcInfoPeerFacet }) => {
          const { kind } = args;
          console.info(`⚡️ onClick:`, args);

          /**
           * START/END Media Stream.
           */
          if (kind === 'Video') {
            const current = state.current.camera;
            if (!current) {
              const camera = await getStream('camera');
              state.change((d) => (d.camera = camera));
            } else {
              current.done();
              state.change((d) => (d.camera = undefined));
            }
          }
        };

        return <PeerControls {...e.state.props} onClick={handleKindClick} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Media', (dev) => {
      const stopCamera = async () => {
        await state.current.camera?.done();
        await state.change((d) => (d.camera = undefined));
      };

      const stopScreen = async () => {
        await state.current.screen?.done();
        await state.change((d) => (d.screen = undefined));
      };

      const renderMedia = (stream?: MediaStream) => {
        if (!stream) return '';
        return <MediaStream.Video stream={stream} width={16} height={16} borderRadius={2} />;
      };

      dev.button((btn) =>
        btn
          .label('stop camera')
          .right((e) => renderMedia(e.state.camera?.media))
          .onClick(stopCamera),
      );

      dev.button((btn) =>
        btn
          .label('stop screen')
          .right((e) => renderMedia(e.state.screen?.media))
          .onClick(stopScreen),
      );

      dev.hr(-1, 5);

      dev.button('stop all', (e) => {
        stopCamera();
        stopScreen();
      });
    });

    const fieldSelector = (
      title: string,
      prop: keyof PeerControlsProps,
      change: (fields?: t.WebRtcInfoPeerFacet[]) => void,
    ) => {
      dev.section(title, (dev) => {
        dev.row((e) => {
          return (
            <PropList.FieldSelector
              style={{ Margin: [10, 40, 5, 30] }}
              all={PeerControls.FIELDS}
              selected={e.state.props[prop] as string[]}
              showIndexes={false}
              onClick={(ev) => {
                const next = ev.next as t.WebRtcInfoPeerFacet[];
                const fields = next?.length === 0 ? undefined : next;
                change(fields);
              }}
            />
          );
        });
      });
    };

    dev.hr(5, 20);

    fieldSelector('Spinning', 'spinning', (fields) => {
      dev.change((d) => (d.props.spinning = fields));
      local.spinning = fields;
    });
    dev.hr(5, [5, 15]);
    fieldSelector('Off', 'off', (fields) => {
      dev.change((d) => (d.props.off = fields));
      local.off = fields;
    });
    dev.hr(5, [5, 15]);
    fieldSelector('Disabled', 'disabled', (fields) => {
      dev.change((d) => (d.props.disabled = fields));
      local.disabled = fields;
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

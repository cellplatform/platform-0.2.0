import { PropList, Dev, WebRtc, t } from '../../../test.ui';
import { PeerControls, PeerControlsProps } from '../ui.PeerControls';

type T = {
  camera?: t.PeerGetMediaStreamRes;
  screen?: t.PeerGetMediaStreamRes;
  props: PeerControlsProps;
};
const initial: T = { props: {} };

type LocalStore = {
  disabled?: t.WebRtcInfoPeerFacet[];
  selected?: t.WebRtcInfoPeerFacet[];
  spinning?: t.WebRtcInfoPeerFacet[];
};

export default Dev.describe('PeerFacets', (e) => {
  const getStream = WebRtc.Media.singleton().getStream;

  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.net.webrtc.Info.PeerFacets');
  const local = localstore.object({
    disabled: undefined,
    selected: undefined,
    spinning: undefined,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    state.change((d) => {
      d.props.disabled = local.disabled;
      d.props.selected = local.selected;
      d.props.spinning = local.spinning;
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
              // START
              const camera = await getStream('camera');
              state.change((d) => (d.camera = camera));
            } else {
              // END
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

      dev.button((btn) =>
        btn
          .label('stop camera')
          .right((e) => (e.state.camera ? '←' : ''))
          .onClick(stopCamera),
      );

      dev.button((btn) =>
        btn
          .label('stop screen')
          .right((e) => (e.state.screen ? '←' : ''))
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

    dev.hr(5, 15);
    fieldSelector('Disabled', 'disabled', (fields) => {
      dev.change((d) => (d.props.disabled = fields));
      local.disabled = fields;
    });
    dev.hr(5, 15);
    fieldSelector('Selected', 'selected', (fields) => {
      dev.change((d) => (d.props.selected = fields));
      local.selected = fields;
    });
    fieldSelector('Spinning', 'spinning', (fields) => {
      dev.change((d) => (d.props.spinning = fields));
      local.spinning = fields;
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

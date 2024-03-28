import { PropList, Dev, WebRtc, type t, MediaStream } from './common';
import { PeerCtrls, PeerCtrlsProps } from '../ui/PeerCtrls';

type T = {
  camera?: t.PeerGetMediaStreamRes;
  screen?: t.PeerGetMediaStreamRes;
  props: PeerCtrlsProps;
};
const initial: T = {
  props: { peerid: 'p-foo', isOverParent: true },
};

type LocalStore = {
  spinning?: t.WebRtcInfoPeerFacet[];
  disabled?: t.WebRtcInfoPeerFacet[];
  off?: t.WebRtcInfoPeerFacet[];
};

export default Dev.describe('PeerFacets', (e) => {
  const getStream = WebRtc.Media.singleton().getStream;

  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.net.webrtc.Info.PeerFacets');
  const local = localstore.object({
    spinning: undefined,
    disabled: undefined,
    off: undefined,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    state.change((d) => {
      d.props.disabled = local.disabled;
      d.props.spinning = local.spinning;
      d.props.off = local.off;
    });

    ctx.debug.width(300);
    ctx.host.tracelineColor(-0.05);
    ctx.subject
      .backgroundColor(1)
      .size([null, null])
      .display('grid')

      .render<T>((e) => {
        const handleKindClick: t.WebRtcInfoPeerCtrlsClickHandler = async (e) => {
          const { kind } = e;
          console.info(`⚡️ onClick:`, e);

          /**
           * START/END Media Stream.
           */
          if (kind === 'Video') {
            const current = state.current.camera;
            if (!current) {
              state.change((d) => (d.props.spinning = ['Video']));
              const camera = await getStream('camera');
              state.change((d) => {
                d.camera = camera;
                d.props.spinning = undefined;
              });
            } else {
              current.done();
              state.change((d) => {
                d.camera = undefined;
                d.props.spinning = undefined;
              });
            }
          }
        };

        return <PeerCtrls {...e.state.props} onClick={handleKindClick} />;
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
        return (
          <MediaStream.Video muted={true} stream={stream} width={16} height={16} borderRadius={2} />
        );
      };

      dev.button((btn) =>
        btn
          .label('stop video')
          .enabled((e) => Boolean(e.state.camera))
          .spinner((e) => (e.state.props.spinning ?? []).includes('Video'))
          .right((e) => renderMedia(e.state.camera?.media))
          .onClick(stopCamera),
      );

      dev.button((btn) =>
        btn
          .label('stop screen')
          .enabled((e) => Boolean(e.state.screen))
          .spinner((e) => (e.state.props.spinning ?? []).includes('Screen'))
          .right((e) => renderMedia(e.state.screen?.media))
          .onClick(stopScreen),
      );

      dev.hr(-1, 5);

      dev.button((btn) =>
        btn
          .label('stop all')
          .enabled((e) => Boolean(e.state.camera || e.state.screen))
          .onClick(() => {
            stopCamera();
            stopScreen();
          }),
      );
    });

    dev.hr(5, 20);

    dev.section('Properties', (dev) => {
      dev.boolean((btn) =>
        btn
          .label((e) => `isSelf`)
          .value((e) => e.state.props.isSelf)
          .onClick((e) => e.change((d) => Dev.toggle(d.props, 'isSelf'))),
      );
    });

    const fieldSelector = (
      title: string,
      prop: keyof PeerCtrlsProps,
      change: (fields?: t.WebRtcInfoPeerFacet[]) => void,
    ) => {
      dev.section(title, (dev) => {
        dev.row((e) => {
          return (
            <Dev.FieldSelector
              style={{ Margin: [10, 40, 5, 30] }}
              all={PeerCtrls.FIELDS}
              selected={e.state.props[prop] as string[]}
              indexes={false}
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

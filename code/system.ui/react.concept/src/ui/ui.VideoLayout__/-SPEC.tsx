import { VideoLayout } from '.';
import { Dev, type t } from '../../test.ui';
import { ScalePlacement } from './-SPEC.ScalePlacement';
import { Video } from './common';

const DEFAULTS = VideoLayout.DEFAULTS;
const SAMPLE = {
  RowanVideo: 612010014,
  Tubes: 499921561,
};

type T = {
  status?: t.VideoStatus;
  props: t.VideoLayoutProps__;
  debug: { editingVideoId?: string };
};

const initial: T = {
  props: {},
  debug: {},
};
const name = 'VideoLayout';

export default Dev.describe(name, (e) => {
  type LocalStore = Pick<t.VideoLayoutProps__, 'debug'> &
    Pick<t.VideoLayout__, 'position'> &
    Pick<t.VideoLayoutProps__, 'muted'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.concept.VideoLayout');
  const local = localstore.object({
    position: DEFAULTS.data.position,
    muted: false,
    debug: false,
  });

  const State = {
    data(props: t.VideoLayoutProps__) {
      return props.data ?? (props.data = {});
    },
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      const video = State.data(d.props);
      video.position = local.position;
      video.innerScale = 1.1;
      video.id = SAMPLE.RowanVideo;
      video.height = 0.3;
      video.minHeight = 180;

      d.props.muted = local.muted;
      d.props.debug = local.debug;
    });

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        return (
          <VideoLayout
            {...e.state.props}
            onStatus={(e) => state.change((d) => (d.status = e.status))}
            onSize={(e) => console.info(`⚡️ onSize`, e)}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Video', (dev) => {
      dev.row((e) => {
        const { props } = e.state;
        return (
          <ScalePlacement
            position={props.data?.position}
            percent={props.data?.height}
            onChange={(e) => {
              state.change((d) => {
                const data = State.data(d.props);
                data.position = local.position = e.position;
                data.height = e.percent;
              });
            }}
          />
        );
      });

      dev.hr(5, 20);

      dev.textbox((txt) => {
        txt
          .label((e) => 'Video Source (ID)')
          .placeholder('eg. Vimeo number')
          .value((e) => e.state.debug.editingVideoId)
          .onChange((e) => e.change((d) => (d.debug.editingVideoId = e.to.value)))
          .onEnter((e) =>
            e.change((d) => {
              const edited = (d.debug.editingVideoId || '').trim();
              const next = edited || SAMPLE.RowanVideo;
              State.data(d.props).id = next;
            }),
          );
      });
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.debug);
        btn
          .label((e) => `debug`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.debug = Dev.toggle(d.props, 'debug'))));
      });
      dev.button((btn) => {
        btn
          .label(`copy to clipboard`)
          .right((e) => `←`)
          .onClick((e) => {
            const data = State.data(state.current.props);
            const json = JSON.stringify(data, null, '  ');
            navigator.clipboard.writeText(json);
          });
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return (
        <div>
          <Video.PlayBar
            style={{ marginTop: 5, marginBottom: 15 }}
            status={e.state.status}
            useKeyboard={true}
            onSeek={(e) => state.change((d) => (d.props.timestamp = e.seconds))}
            onMute={(e) => state.change((d) => (local.muted = d.props.muted = e.muted))}
            onPlayAction={(e) => {
              state.change((d) => {
                d.props.playing = e.is.playing;
                if (e.replay) d.props.timestamp = 0;
              });
            }}
          />
          <Dev.Object name={name} data={data} expand={1} />
        </div>
      );
    });
  });
});

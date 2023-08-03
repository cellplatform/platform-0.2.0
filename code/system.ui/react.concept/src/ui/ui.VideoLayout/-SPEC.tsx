import { VideoLayout } from '.';
import { Dev, type t } from '../../test.ui';
import { ScalePlacement } from './-SPEC.ScalePlacement';
import { Video } from './common';

const DEFAULTS = VideoLayout.DEFAULTS;

type T = {
  props: t.VideoLayoutProps;
  status?: t.VideoStatus;
};

const initial: T = {
  props: {},
};
const name = 'VideoLayout';

export default Dev.describe(name, (e) => {
  type LocalStore = Pick<t.VideoLayout, 'position'> & Pick<t.VideoLayoutProps, 'muted'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.concept.VideoLayout');
  const local = localstore.object({
    position: DEFAULTS.data.position,
  });

  const State = {
    video(props: t.VideoLayoutProps) {
      return props.data ?? (props.data = {});
    },
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      const video = State.video(d.props);
      video.position = local.position;
      video.innerScale = 1.1;
      video.id = 612010014; // Sample - (Rowan)
      video.height = 0.3;
      video.minHeight = 180;

      d.props.muted = local.muted;
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
            onPositionChange={(e) => {
              state.change((d) => {
                local.position = State.video(d.props).position = e.position;
              });
            }}
          />
        );
      });

      // dev.hr(0, 5);

      dev.hr(5, 20);

      dev.textbox((txt) => {
        txt
          .label((e) => 'Video Source (ID)')
          .placeholder('eg. Vimeo number')
          .value((e) => '')
          .onChange((e) => {})
          .onEnter((e) => {});
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
            style={{ marginBottom: 10 }}
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

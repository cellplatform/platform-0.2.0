import { VideoLayout } from '.';
import { Dev, type t } from '../../test.ui';
import { ScalePlacement } from './-SPEC.ScalePlacement';
import { Video } from './common';

const DEFAULTS = VideoLayout.DEFAULTS;

type T = { props: t.VideoLayoutProps };
const initial: T = { props: {} };
const name = 'VideoLayout';

export default Dev.describe(name, (e) => {
  type LocalStore = Pick<t.VideoLayout, 'position'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.concept.VideoLayout');
  const local = localstore.object({
    position: DEFAULTS.data.position,
  });

  const State = {
    video(props: t.VideoLayoutProps) {
      return props.video ?? (props.video = {});
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
    });

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        return <VideoLayout {...e.state.props} />;
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
            position={props.video?.position}
            onPositionChange={(e) => {
              state.change((d) => {
                local.position = State.video(d.props).position = e.position;
              });
            }}
          />
        );
      });

      dev.hr(0, 5);
      dev.textbox((txt) => {
        txt
          .label((e) => 'Video Source (ID)')
          .placeholder('eg. Vimeo number')
          .value((e) => '')
          .onChange((e) => {})
          .onEnter((e) => {});
      });
    });

    dev.hr(5, 20);

    dev.section('Image', (dev) => {
      dev.row((e) => <ScalePlacement />);
      dev.hr(0, 5);
      dev.textbox((txt) => {
        txt
          .label((e) => 'Image Source')
          .placeholder('eg. domain.com/image.png')
          .value((e) => '')
          .onChange((e) => {})
          .onEnter((e) => {});
      });
    });

    dev.hr(5, 20);

    dev.TODO();
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      // dev.row((e) => <Video.PlayBar />);

      const data = e.state;
      return (
        <div>
          <Video.PlayBar style={{ marginBottom: 10 }} />
          <Dev.Object name={name} data={data} expand={1} />
        </div>
      );
    });
  });
});

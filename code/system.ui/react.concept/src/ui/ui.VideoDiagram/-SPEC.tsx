import { VideoDiagram } from '.';
import { Dev, R, SAMPLE, type t } from '../../test.ui';
import { Video } from './common';

const DEFAULTS = VideoDiagram.DEFAULTS;

type T = {
  props: t.VideoDiagramProps;
  status?: t.VideoStatus;
};
const initial: T = {
  props: {},
};

/**
 * Spec
 */
const name = VideoDiagram.displayName ?? '';

export default Dev.describe(name, async (e) => {
  type LocalStore = Pick<t.VideoDiagramProps, 'split' | 'debug' | 'muted'>;

  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.concept.VideoDiagram');
  const local = localstore.object({
    split: DEFAULTS.split,
    muted: DEFAULTS.muted,
    debug: false,
  });

  const State = {
    video(state: T) {
      return state.props.video ?? (state.props.video = {});
    },
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.debug = local.debug;
      d.props.split = local.split;
      d.props.splitMin = 0.1;
      d.props.splitMax = 0.9;
      d.props.muted = local.muted;

      d.props.video = {
        src: SAMPLE.Vimeo.WhiteBackdrop1,
        innerScale: 1.1,
        timestamps: [
          { src: SAMPLE.Diagrams.GroupScale },
          { src: SAMPLE.Diagrams.ProductSystem, start: 3 },
        ],
      };
    });

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        return (
          <VideoDiagram
            {...e.state.props}
            onVideoStatus={(e) => {
              console.info(`⚡️ onVideoStatus`, e);
              state.change((d) => (d.status = e.status));
            }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.header
      .padding(15)
      .border(-0.1)
      .render<T>((e) => {
        return (
          <Video.PlayBar
            size={'Small'}
            style={{}}
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
        );
      });

    dev.section('Properties', (dev) => {
      dev.hr(0, 3);
      dev.row((e) => {
        return (
          <VideoDiagram.Props.Split
            props={e.state.props}
            onChange={(e) => {
              state.change((d) => (local.split = d.props.split = e.split));
            }}
          />
        );
      });
    });

    // dev.hr(0, 10);
    // dev.row((e) => {
    //   return (
    //     <VideoDiagram.Props.ImageScale
    //       props={e.state.props}
    //       // onChange={(e) => state.change((d) => (State.image(d).scale = e.percent * 2))}
    //     />
    //   );
    // });

    // dev.hr(5, 20);

    // dev.section('Image', (dev) => {
    //   const image = (label: string, src: t.ImageSrc) => {
    //     dev.button((btn) => {
    //       btn
    //         .label(label)
    //         .right((e) => R.equals(State.image(e.state).src, src) && `←`)
    //         .onClick((e) => {
    //           e.change((d) => {
    //             const image = State.image(d);
    //             image.src = src;
    //             image.sizing = 'contain';
    //           });
    //         });
    //     });
    //   };
    //   image('group scale', SAMPLE.Diagrams.GroupScale);
    //   image('product system', SAMPLE.Diagrams.ProductSystem);
    // });

    dev.hr(0, 20);

    dev.section('Video', (dev) => {
      const video = (label: string, src: t.VideoSrc) => {
        dev.button((btn) => {
          btn
            .label(label)
            .right((e) => R.equals(State.video(e.state).src, src) && `←`)
            .onClick((e) => {
              e.change((d) => {
                const video = State.video(d);
                video.src = src;
                video.innerScale = 1.05;
              });
            });
        });
      };
      video('white backdrop (tonal 1)', SAMPLE.Vimeo.WhiteBackdrop1);
      video('white backdrop (tonal 2)', SAMPLE.Vimeo.WhiteBackdrop2);
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
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.footer.border(-0.1).render<T>((e) => {
      const props = e.state.props;
      const split = Number((e.state.props.split ?? 0).toFixed(2));
      const data = {
        props: { ...props, split },
        'props:split': split,
        'video:status': e.state.status,
      };
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});

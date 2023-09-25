import { VideoPlayer } from '.';
import { SAMPLE, Dev, Icons, Video, type t } from '../../test.ui';

const DEFAULTS = VideoPlayer.DEFAULTS;

type T = {
  props: t.VideoPlayerProps;
  debug: {};
  status?: t.VideoStatus;
};
const initial: T = {
  props: {},
  debug: {},
};

/**
 * Vime Docs:
 * https://vimejs.com/
 */
export default Dev.describe('Player (Vime)', (e) => {
  type LocalStore = Pick<
    t.VideoPlayerProps,
    'video' | 'playing' | 'loop' | 'borderRadius' | 'muted' | 'enabled' | 'width' | 'height'
  >;
  const localstore = Dev.LocalStorage<LocalStore>('dev:ext.ui.react.vime.Player');
  const local = localstore.object({
    video: SAMPLE.VIMEO.Tubes,
    playing: DEFAULTS.playing,
    loop: DEFAULTS.loop,
    muted: DEFAULTS.muted,
    enabled: DEFAULTS.enabled,
    borderRadius: DEFAULTS.borderRadius,
    width: 500,
    height: undefined,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.playing = local.playing;
      d.props.loop = local.loop;
      d.props.video = local.video;
      d.props.borderRadius = local.borderRadius;
      d.props.muted = local.muted;
      d.props.enabled = local.enabled;
      d.props.width = local.width;
      d.props.height = local.height;
    });

    ctx.debug.width(330);
    ctx.subject.display('grid').render<T>((e) => {
      const { props } = e.state;
      return (
        <VideoPlayer
          {...props}
          onStatus={(e) => {
            /**
             * Update host state: → "status"
             */
            state.change((d) => (d.status = e.status));
          }}
        />
      );
    });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const ctx = dev.ctx;
    const state = await dev.state();

    dev.section('Properties', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.enabled);
        btn
          .label((e) => 'enabled')
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.enabled = Dev.toggle(d.props, 'enabled'))));
      });

      dev.hr(-1, 5);

      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.playing);
        btn
          .label((e) => (value(e.state) ? 'playing' : 'paused'))
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.playing = Dev.toggle(d.props, 'playing'))));
      });

      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.loop);
        btn
          .label((e) => `loop`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.loop = Dev.toggle(d.props, 'loop'))));
      });

      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.muted);
        btn
          .label((e) => `muted`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.muted = Dev.toggle(d.props, 'muted'))));
      });

      dev.hr(-1, 5);

      dev.boolean((btn) => {
        const value = (state: T) => state.props.borderRadius ?? 0;
        btn
          .label((e) => `borderRadius: ${value(e.state)}px`)
          .value((e) => value(e.state) > 0)
          .onClick(async (e) => {
            await e.change((d) => (d.props.borderRadius = value(d) > 0 ? 0 : 10));
            local.borderRadius = state.current.props.borderRadius;
          });
      });
    });

    dev.row((e) => {
      return (
        <Video.PlayBar
          style={{ marginTop: 25, marginBottom: 25 }}
          status={e.state.status}
          size={'Small'}
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

    dev.section(['Video', '(Source)'], (dev) => {
      const def = (def: t.VideoSrc, hint?: string) => {
        const isCurrent = () => def.src === state.current.props.video?.src;

        let id = def.src ? `${def.src.substring(0, 4)}..` : 'empty';
        let label = `${def.kind}:${id} ${hint ? `← ${hint}` : ''}`;

        dev.button((btn) => {
          btn
            .label(label)
            .right((e) => isCurrent() && <Icons.Photo size={16} />)
            .onClick((e) => e.change((d) => (local.video = d.props.video = def)));
        });
      };

      def(SAMPLE.VIMEO.Tubes, 'Tubes');
      def(SAMPLE.VIMEO.Running, 'Running');
      dev.hr(-1, 5);
      def(SAMPLE.YOUTUBE.AlanKay, 'Alan Kay');
      def(SAMPLE.YOUTUBE.LocalFirst, 'Local First @pvh');
      dev.hr(-1, 5);
      def(SAMPLE.VIDEO.GmFarcaster, 'IPFS: GM Farcaster');
      dev.hr(-1, 5);
      def(DEFAULTS.unknown);
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      type Dimension = 'width' | 'height';

      const size = (dimension: Dimension, value: t.Pixels) => {
        const other = dimension === 'width' ? 'height' : 'width';
        dev.button((btn) => {
          btn
            .label(`resize → ${dimension}: ${value}px`)
            .right((e) => e.state.props[dimension] === value && <Icons.Photo size={16} />)
            .onClick((e) => {
              e.change((d) => {
                local[dimension] = d.props[dimension] = value;
                local[other] = d.props[other] = undefined;
              });
            });
        });
      };

      size('width', 500);
      size('width', 300);
      size('height', 200);
      size('height', 400);
    });

    dev.hr(5, 20);

    dev.section('Timestamp', (dev) => {
      const timestamp = (secs?: t.Seconds, label?: string) => {
        const value = (state: T) => state.props.timestamp;
        dev.button((btn) => {
          btn
            .label(label ?? `${secs} seconds`)
            .right((e) => (value(e.state) === secs ? `←` : ''))
            .onClick((e) => e.change((d) => (d.props.timestamp = secs)));
        });
      };

      timestamp(undefined, '(undefined)');
      timestamp(0);
      timestamp(10);

      // dev.row((e) => {
      //   const { status } = e.state;
      //   return (
      //     <ProgressBar
      //       style={{ MarginX: 0 }}
      //       percent={status?.percent.complete}
      //       buffered={status?.percent.buffered}
      //       onClick={(e) => {
      //         console.info('⚡️ progress → click', e);
      //         state.change((d) => (d.props.timestamp = e.timestamp(d.status?.secs.total)));
      //       }}
      //     />
      //   );
      // });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.footer.border(-0.1).render<T>((e) => {
      const { props, status } = e.state;
      const data = { props, status };
      return (
        <Dev.Object
          name={'VideoPlayer'}
          data={data}
          expand={{ level: 1, paths: ['$', '$.status', '$.status.secs', '$.status.is'] }}
        />
      );
    });
  });
});

import { Dev, R, Video, css, type t } from '../../test.ui';

import { PlayBar } from '.';
import { SAMPLE } from '../ui.VideoPlayer/-dev/-Sample.mjs';

const DEFAULTS = PlayBar.DEFAULTS;

type T = {
  props: t.PlayBarProps;
  player: t.VideoPlayerProps;
  debug: { devBg?: boolean; devRight?: boolean };
};
const initial: T = { props: {}, player: {}, debug: {} };

export default Dev.describe('PlayBar', (e) => {
  const sidebarWidth = 350;

  /**
   * LocalStorage
   */
  type LocalStore = Pick<t.PlayBarProps, 'enabled' | 'replay' | 'useKeyboard' | 'size'> &
    Pick<T['debug'], 'devBg' | 'devRight'> &
    Pick<t.VideoPlayerProps, 'video'>;

  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.concept.PlayBar');
  const local = localstore.object({
    enabled: DEFAULTS.enabled,
    replay: DEFAULTS.replay,
    size: DEFAULTS.size,
    useKeyboard: true,
    devBg: false,
    devRight: false,
    video: SAMPLE.VIMEO.Tubes,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.enabled = local.enabled;
      d.props.replay = local.replay;
      d.props.useKeyboard = local.useKeyboard;
      d.props.size = local.size;

      d.debug.devBg = local.devBg;
      d.debug.devRight = local.devRight;

      d.player.video = local.video;
    });

    ctx.debug.width(sidebarWidth);
    ctx.subject
      .backgroundColor(1)
      .size('fill-x')
      .display('grid')
      .render<T>((e) => {
        const { debug } = e.state;
        const margin = debug.devBg ? 5 : 0;
        ctx.subject.backgroundColor(debug.devBg ? 1 : 0);

        const styles = {
          right: css({
            backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
            PaddingX: 20,
            fontSize: 18,
            display: 'grid',
            placeItems: 'center',
          }),
        };
        const elRight = debug.devRight && <div {...styles.right}>{'🐷'}</div>;

        return (
          <PlayBar
            {...e.state.props}
            style={{ margin }}
            right={elRight}
            /**
             * State updates: → <Video.Player>
             */
            onPlayAction={(e) => {
              console.info('⚡️ onPlayClick', e);
              state.change((d) => {
                d.player.playing = e.is.playing;

                // Replay.
                if (e.replay) d.player.timestamp = 0;

                // Alt: Restart (if not in replay mode, but at end of video).
                if (d.props.status?.is.complete && e.play) d.player.timestamp = 0;
              });
            }}
            onSeek={(e) => {
              console.info('⚡️ onSeek', e);
              state.change((d) => (d.player.timestamp = e.seconds));
            }}
            onMute={(e) => {
              console.info('⚡️ onMute', e);
              state.change((d) => (d.player.muted = e.muted));
            }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section(/* Video Player */ '', (dev) => {
      dev.row((e) => {
        const { props } = e.state;
        const styles = {
          base: css({
            display: 'grid',
            placeItems: 'center',
            marginBottom: 15,
            marginTop: 5,
          }),
        };
        return (
          <div {...styles.base}>
            <Video.Player
              {...e.state.player}
              enabled={props.enabled}
              innerScale={1.1}
              borderRadius={10}
              width={sidebarWidth - 50}
              onStatus={(e) => state.change((d) => (d.props.status = e.status))}
            />
          </div>
        );
      });

      const video = (label: string, src: t.VideoSrc) => {
        dev.button((btn) => {
          btn
            .label(`video: ${label}`)
            .right((e) => R.equals(e.state.player.video, src) && `←`)
            .onClick((e) => e.change((d) => (local.video = d.player.video = src)));
        });
      };
      video('tubes', SAMPLE.VIMEO.Tubes);
      video('white backdrop (tonal 1)', SAMPLE.VIMEO.WhiteBackdrop1);
      video('white backdrop (tonal 2)', SAMPLE.VIMEO.WhiteBackdrop2);

      dev.hr(-1, 15);
    });

    dev.section('Properties', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.enabled);
        btn
          .label((e) => `enabled`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.enabled = Dev.toggle(d.props, 'enabled'))));
      });

      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.replay);
        btn
          .label((e) => `replay`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.replay = Dev.toggle(d.props, 'replay'))));
      });

      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.useKeyboard);
        btn
          .label((e) => `useKeyboard`)
          .value((e) => value(e.state))
          .onClick((e) => {
            e.change((d) => (local.useKeyboard = Dev.toggle(d.props, 'useKeyboard')));
          });
      });
    });

    dev.hr(5, 20);

    dev.section('Size', (dev) => {
      const button = (value: t.PlayButtonSize) => {
        dev.button((btn) => {
          btn
            .label(`size: ${value}`)
            .right((e) => e.state.props.size === value && `←`)
            .onClick((e) => e.change((d) => (local.size = d.props.size = value)));
        });
      };
      PlayBar.sizes.forEach(button);
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.debug.devBg);
        btn
          .label((e) => `background`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.devBg = Dev.toggle(d.debug, 'devBg'))));
      });
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.debug.devRight);
        btn
          .label((e) => `right (element)`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.devRight = Dev.toggle(d.debug, 'devRight'))));
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.footer.border(-0.1).render<T>((e) => {
      const { props, player: video } = e.state;
      const status = props.status;
      const percentComplete = Number((status?.percent.complete ?? 0).toFixed(2));
      const data = {
        props: { playbar: props, video },
        'props:playbar:status:percent': percentComplete,
        'props:playbar:status': status,
      };
      return <Dev.Object name={'PlayBar'} data={data} expand={1} />;
    });
  });
});

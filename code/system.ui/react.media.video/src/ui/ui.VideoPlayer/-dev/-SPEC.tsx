import { Dev, type t } from '../../../test.ui';
import { VideoPlayer } from '..';
import { SAMPLE } from './-Sample.mjs';

const DEFAULTS = VideoPlayer.DEFAULTS;

type T = {
  props: t.VideoPlayerProps;
  debug: { devWidth?: number };
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
  type LocalStore = Pick<T['debug'], 'devWidth'> &
    Pick<t.VideoPlayerProps, 'video' | 'playing' | 'loop'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:ext.ui.react.vime.Player');
  const local = localstore.object({
    devWidth: 500,
    video: SAMPLE.VIMEO.Tubes,
    playing: DEFAULTS.playing,
    loop: DEFAULTS.loop,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.playing = local.playing;
      d.props.loop = local.loop;
      d.props.video = local.video;
      d.debug.devWidth = local.devWidth;
    });

    ctx.subject
      // .backgroundColor(1)
      .display('grid')
      .render<T>((e) => {
        const { debug, props } = e.state;
        ctx.subject.size([debug.devWidth, null]);
        return (
          <VideoPlayer
            {...props}
            onChange={(e) => {
              // console.info(`⚡️ onChange`, e.status);
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
    });

    dev.hr(5, 20);

    dev.section(['Video', '(Source)'], (dev) => {
      const def = (def: t.VideoDef, hint?: string) => {
        const isCurrent = () => def.id === state.current.props.video?.id;
        dev.button((btn) => {
          btn
            .label(`${def.kind}: “${def.id || '(empty)'}” ${hint ? `(${hint})` : ''}`)
            .right((e) => (isCurrent() ? `←` : ''))
            .onClick((e) => e.change((d) => (local.video = d.props.video = def)));
        });
      };

      def(SAMPLE.VIMEO.Tubes, 'Tubes');
      def(SAMPLE.VIMEO.Running, 'Running');
      dev.hr(-1, 5);
      def(SAMPLE.YOUTUBE.AlanKay, 'Alan Kay');
      dev.hr(-1, 5);
      def(DEFAULTS.unknown);
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      const width = (width: number) => {
        dev.button((btn) => {
          btn
            .label(`width: ${width}`)
            .right((e) => (e.state.debug.devWidth === width ? `←` : ''))
            .onClick((e) => {
              e.change((d) => (local.devWidth = d.debug.devWidth = width));
            });
        });
      };

      width(500);
      width(300);
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

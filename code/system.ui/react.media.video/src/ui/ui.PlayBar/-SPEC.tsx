import { Dev, type t, css } from '../../test.ui';
import { PlayBar } from '.';
import { VideoPlayer } from '../ui.VideoPlayer';
import { SAMPLE } from '../ui.VideoPlayer/-dev/-Sample.mjs';

const DEFAULTS = PlayBar.DEFAULTS;

type T = {
  props: t.PlayBarProps;
  player: t.VideoPlayerProps;
  debug: { devBg?: boolean; devRight?: boolean };
};
const initial: T = {
  props: {},
  player: { video: SAMPLE.VIMEO.Tubes },
  debug: {},
};

export default Dev.describe('PlayBar', (e) => {
  /**
   * LocalStorage
   */
  type LocalStore = Pick<T['debug'], 'devBg' | 'devRight'> & Pick<t.PlayBarProps, 'enabled'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.concept.PlayBar');
  const local = localstore.object({
    enabled: DEFAULTS.enabled,
    devBg: false,
    devRight: false,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.enabled = local.enabled;
      d.debug.devBg = local.devBg;
      d.debug.devRight = local.devRight;
    });

    ctx.subject
      .backgroundColor(1)
      .size('fill-x')
      .display('grid')
      .render<T>((e) => {
        const { debug } = e.state;
        ctx.subject.backgroundColor(debug.devBg ? 1 : 0);
        const margin = debug.devBg ? 5 : 0;

        const styles = {
          right: css({
            display: 'grid',
            placeItems: 'center',
            backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
            PaddingX: 20,
            fontSize: 18,
          }),
        };
        const elRight = debug.devRight && <div {...styles.right}>{'🐷'}</div>;

        return (
          <PlayBar
            {...e.state.props}
            style={{ margin }}
            right={elRight}
            /**
             * State updates: → <VideoPlayer>
             */
            onPlayClick={(e) => {
              console.info('⚡️ onPlayClick', e);
              state.change((d) => (d.player.playing = e.is.playing));
            }}
            onProgressClick={(e) => {
              console.info('⚡️ onProgressClick', e);
              state.change((d) => {
                const total = d.props.status?.secs.total;
                d.player.timestamp = e.timestamp(total);
              });
            }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.row((e) => {
      const { props, player: video } = e.state;
      return (
        <VideoPlayer
          {...video}
          enabled={props.enabled}
          borderRadius={10}
          onChange={(e) => {
            state.change((d) => (d.props.status = e.status));
          }}
        />
      );
    });

    dev.hr(0, 15);

    dev.section('Properties', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.enabled);
        btn
          .label((e) => `enabled`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.enabled = Dev.toggle(d.props, 'enabled'))));
      });
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

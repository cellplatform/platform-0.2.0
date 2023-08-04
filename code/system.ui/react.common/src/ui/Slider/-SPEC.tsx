import { css, COLORS, Dev, type t } from '../../test.ui';

import { Slider } from '.';
import { Wrangle } from './Wrangle';

const DEFAULTS = Slider.DEFAULTS;

type T = { props: t.SliderProps };
const initial: T = { props: {} };

export default Dev.describe('Slider', (e) => {
  type LocalStore = Pick<t.SliderProps, 'enabled' | 'percent'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.common.Slider');
  const local = localstore.object({
    enabled: DEFAULTS.enabled,
    percent: DEFAULTS.percent,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.width = 350;
      d.props.enabled = local.enabled;
      d.props.percent = local.percent;
    });

    ctx.subject.display('grid').render<T>((e) => {
      return (
        <Slider
          {...e.state.props}
          onChange={(e) => {
            console.info('⚡️ onChange', e);
            state.change((d) => (local.percent = d.props.percent = e.percent));
          }}
        />
      );
    });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

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

    dev.section('Configuration Samples', (dev) => {
      type Args = {
        thumb: t.SliderThumbProps;
        track: t.SliderTrackProps;
        ticks: t.SliderTickProps;
      };
      const config = (label: string, fn?: (e: Args) => void) => {
        dev.button((btn) => {
          btn.label(label).onClick((e) =>
            e.change((d) => {
              const partial = {
                thumb: d.props.thumb ?? (d.props.thumb = DEFAULTS.thumb),
                track: d.props.track ?? (d.props.track = DEFAULTS.track),
                ticks: d.props.ticks ?? (d.props.ticks = DEFAULTS.ticks),
              };
              const thumb = Wrangle.thumb(partial.thumb);
              const track = Wrangle.track(partial.track);
              const ticks = Wrangle.ticks(partial.ticks);
              fn?.({ thumb, track, ticks });
              d.props.thumb = thumb;
              d.props.track = track;
              d.props.ticks = ticks;
            }),
          );
        });
      };

      config('(reset)', (e) => {
        e.thumb.size = DEFAULTS.thumb.size;
        e.track.height = DEFAULTS.track.height;
        e.ticks.items = DEFAULTS.ticks.items;
      });

      dev.hr(-1, 5);

      config('skinny track', (e) => {
        e.track.height = 5;
        e.thumb.size = 15;
      });

      config('smaller thumb than track', (e) => {
        e.track.height = 20;
        e.thumb.size = 10;
      });

      dev.hr(-1, 5);

      config('blue', (e) => (e.track.highlighColor = COLORS.BLUE));
      config('green', (e) => (e.track.highlighColor = COLORS.GREEN));

      dev.hr(-1, 5);

      config('ticks', (e) => {
        const style = css({
          backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
          Absolute: [0, -5, 0, -5],
        });
        e.ticks.items = [
          0.25,
          { value: 0.5, label: 'Midway' },
          { value: 0.75, el: <div {...style} /> },
          undefined,
          false,
        ];
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const { props } = e.state;
      const percent = Number(props.percent?.toFixed(2) ?? 0);
      const data = {
        props,
        'props:percent': percent,
      };
      return <Dev.Object name={'Slider'} data={data} expand={1} />;
    });
  });
});

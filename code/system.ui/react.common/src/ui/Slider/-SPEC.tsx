import { Slider } from '.';
import { Dev, type t } from '../../test.ui';
import { Wrangle } from './Wrangle.mjs';

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
      d.props.enabled = local.enabled;
      d.props.percent = local.percent;
    });

    ctx.subject
      .size([350, null])
      .display('grid')
      .render<T>((e) => {
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

    dev.section('Sample States', (dev) => {
      type Args = { thumb: t.SliderThumbProps; track: t.SliderTrackProps };
      const config = (label: string, fn: (e: Args) => void) => {
        dev.button((btn) => {
          btn.label(label).onClick((e) =>
            e.change((d) => {
              const partial = {
                thumb: d.props.thumb ?? (d.props.thumb = DEFAULTS.thumb),
                track: d.props.track ?? (d.props.track = DEFAULTS.track),
              };
              const thumb = Wrangle.thumb(partial.thumb);
              const track = Wrangle.track(partial.track);
              fn({ thumb, track });
              d.props.thumb = thumb;
              d.props.track = track;
            }),
          );
        });
      };

      config('(default)', (e) => {
        e.thumb.size = DEFAULTS.thumb.size;
        e.track.height = DEFAULTS.track.height;
      });

      config('skinny track', (e) => {
        e.track.height = 5;
        console.log('e.track', e.track);
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const { props } = e.state;
      const data = {
        props,
        'props:percent': props.percent,
      };
      return <Dev.Object name={'Slider'} data={data} expand={1} />;
    });
  });
});

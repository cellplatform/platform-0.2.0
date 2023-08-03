import { Dev, type t, Slider } from '../../test.ui';
import { SplitHorizon } from '.';

const DEFAULTS = SplitHorizon.DEFAULTS;

type T = { props: t.SplitHorizonProps };
const initial: T = { props: {} };
const name = 'SplitHorizonLayout';

export default Dev.describe(name, (e) => {
  type LocalStore = Pick<t.SplitHorizonProps, 'debug' | 'split'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.concept.SplitHorizonLayout');
  const local = localstore.object({
    split: DEFAULTS.split,
    debug: true,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.split = local.split;
      d.props.debug = local.debug;
    });

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        return <SplitHorizon {...e.state.props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Properties', (dev) => {
      dev.title('split (ratio)', { bold: false, size: 12, opacity: 0.6 });
      dev.row((e) => {
        return (
          <Slider
            thumb={{ size: 16 }}
            track={{ height: 16 }}
            percent={e.state.props.split}
            onChange={(e) => {
              state.change((d) => (local.split = d.props.split = e.percent));
            }}
          />
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
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const props = e.state.props;
      const percent = Number((props.split ?? 0).toFixed(2));
      const data = {
        props,
        'props:split': percent,
      };
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});

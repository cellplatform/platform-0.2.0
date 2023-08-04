import { Dev, type t } from '../../test.ui';
import { VideoDiagramLayout } from '.';
import { SplitLayout } from './common';

const DEFAULTS = VideoDiagramLayout.DEFAULTS;

type T = { props: t.VideoDiagramLayoutProps };
const initial: T = { props: {} };
const name = VideoDiagramLayout.displayName ?? '';

export default Dev.describe(name, (e) => {
  type LocalStore = Pick<t.VideoDiagramLayoutProps, 'split' | 'debug'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.concept.VideoDiagramLayout');
  const local = localstore.object({
    split: DEFAULTS.split,
    debug: false,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.debug = local.debug;
      d.props.split = local.split;
      d.props.splitMin = 0.1;
      d.props.splitMax = 0.9;
    });

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        return <VideoDiagramLayout {...e.state.props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Properties', (dev) => {
      dev.hr(0, 5);
      dev.row((e) => {
        const { props } = e.state;
        return (
          <SplitLayout.PropEditor
            split={props.split}
            splitMin={props.splitMin}
            splitMax={props.splitMax}
            showAxis={false}
            onChange={(e) => {
              state.change((d) => (local.split = d.props.split = e.split));
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
      const split = Number((e.state.props.split ?? 0).toFixed(2));
      const data = {
        props: { ...props, split },
        'props:split': split,
      };
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});

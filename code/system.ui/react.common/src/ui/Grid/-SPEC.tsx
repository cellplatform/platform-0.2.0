import { css, Dev, type t } from '../../test.ui';
import { Grid } from '.';

const DEFAULTS = Grid.DEFAULTS;

type T = {
  props: t.GridProps;
  debug: { devBg?: boolean; devWithConfig?: boolean };
};
const initial: T = {
  props: {},
  debug: {},
};

export default Dev.describe('Grid', (e) => {
  type LocalStore = Pick<t.GridPropsConfig, 'total'> & Pick<T['debug'], 'devBg' | 'devWithConfig'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.common.Grid');
  const local = localstore.object({
    total: DEFAULTS.total,
    devBg: false,
    devWithConfig: true,
  });

  const State = {
    displayProps(state: T) {
      const debug = state.debug;
      const props = { ...state.props };
      if (!debug.devWithConfig) delete props.config;
      return props;
    },
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      const config = d.props.config ?? DEFAULTS.config;
      config.total = local.total;
      d.props.config = config;
      d.debug.devWithConfig = local.devWithConfig;
      d.debug.devBg = local.devBg;
    });

    ctx.debug.width(330);
    ctx.subject
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        const { debug } = e.state;
        ctx.subject.backgroundColor(debug.devBg ? 1 : 0);
        const props = State.displayProps(e.state);
        const padding = debug.devBg ? 20 : 0;
        return <Grid {...props} style={{ padding }} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('States', (dev) => {
      const total = (total: number, right: string = '') => {
        const config = (state: T) => state.props.config ?? {};
        const current = (state: T) => config(state).total ?? DEFAULTS.total;
        dev.button((btn) => {
          btn
            .label(`total: ${total}`)
            .right((e) => (current(e.state) === total ? `←` : right))
            .onClick((e) => e.change((d) => (local.total = config(d).total = total)));
        });
      };
      total(0);
      total(1);
      dev.hr(-1, 5);
      total(2);
      total(3, '(default)');
      total(8);
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
        const value = (state: T) => Boolean(state.debug.devWithConfig);
        btn
          .label((e) => `${value(e.state) ? 'with' : 'without'} { config }`)
          .value((e) => value(e.state))
          .onClick((e) => {
            e.change((d) => (local.devWithConfig = Dev.toggle(d.debug, 'devWithConfig')));
          });
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const props = State.displayProps(e.state);
      const data = { props };
      return <Dev.Object name={'Grid'} data={data} expand={1} />;
    });
  });
});

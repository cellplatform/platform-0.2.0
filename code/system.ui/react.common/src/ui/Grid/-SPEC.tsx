import { Dev, type t } from '../../test.ui';
import { Grid } from '.';

const DEFAULTS = Grid.DEFAULTS;

type T = {
  props: t.GridProps;
  debug: { devBg?: boolean };
};

export default Dev.describe('Grid', (e) => {
  const initial: T = {
    props: {
      config: {
        gap: 5,

        row(e) {
          // return e.index === 0 ? 2.5 : 1;
          return 1;
        },
        cell(e) {
          if (e.x === 1 && e.y === 2) {
            e.body(<div>{'🌳'}</div>);
          }
        },
      },
    },
    debug: {},
  };

  type LocalStore = Pick<t.GridPropsConfig, 'total'> & Pick<T['debug'], 'devBg'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.common.Grid');
  const local = localstore.object({
    total: DEFAULTS.total,
    devBg: false,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);
    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      const config = (d.props.config = d.props.config ?? {});
      config.total = local.total;
    });

    ctx.debug.width(330);
    ctx.subject
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        const { props, debug } = e.state;
        ctx.subject.backgroundColor(debug.devBg ? 1 : 0);
        return <Grid {...props} style={{ padding: debug.devBg ? 20 : 0 }} />;
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
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={'Grid'} data={data} expand={1} />;
    });
  });
});

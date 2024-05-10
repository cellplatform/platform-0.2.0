import { Dev, type t } from '../../test.ui';
import { ProgressBar } from '.';

const DEFAULTS = ProgressBar.DEFAULTS;

type T = {
  props: t.ProgressBarProps;
  debug: { devBg?: boolean };
};
const initial: T = {
  props: {},
  debug: {},
};

export default Dev.describe('ProgressBar', (e) => {
  type LocalStore = Pick<t.ProgressBarProps, 'percent' | 'buffered' | 'enabled'> &
    Pick<T['debug'], 'devBg'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.common.ProgressBar');
  const local = localstore.object({
    enabled: DEFAULTS.enabled,
    percent: DEFAULTS.percent,
    buffered: DEFAULTS.buffered,
    devBg: false,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.enabled = local.enabled;
      d.props.percent = local.percent;
      d.props.buffered = local.buffered;
      d.debug.devBg = local.devBg;
    });

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size('fill-x')
      .display('grid')
      .render<T>((e) => {
        const { debug, props } = e.state;

        ctx.subject.backgroundColor(debug.devBg ? 1 : 0);

        return (
          <ProgressBar
            {...props}
            onClick={(e) => {
              console.info('⚡️ onClick', e);
              state.change((d) => (d.props.percent = e.percent));
            }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.section('Properties', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.enabled);
        btn
          .label((e) => `enabled`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.enabled = Dev.toggle(d.props, 'enabled'))));
      });

      dev.hr(5, 10);

      const percent = (value: number) => {
        dev.button((btn) => {
          btn
            .label(`percent: ${value}`)
            .right((e) => (e.state.props.percent === value ? '←' : ''))
            .onClick((e) => e.change((d) => (local.percent = d.props.percent = value)));
        });
      };
      percent(0);
      dev.hr(-1, 5);
      percent(0.25);
      percent(0.9);
      dev.hr(-1, 5);
      percent(1);

      dev.hr(5, 10);

      const buffered = (value: number) => {
        dev.button((btn) => {
          btn
            .label(`buffered: ${value}`)
            .right((e) => (e.state.props.buffered === value ? '←' : ''))
            .onClick((e) => e.change((d) => (local.buffered = d.props.buffered = value)));
        });
      };
      buffered(0);
      dev.hr(-1, 5);
      buffered(0.25);
      buffered(0.9);
      dev.hr(-1, 5);
      buffered(1);
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
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={'ProgressBar'} data={data} expand={1} />;
    });
  });
});

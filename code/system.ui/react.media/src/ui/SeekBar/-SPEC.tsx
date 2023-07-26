import { Dev, type t } from '../../test.ui';
import { SeekBar } from '.';

const DEFAULTS = SeekBar.DEFAULTS;

type T = {
  props: t.ProgressBarProps;
  debug: { devBg?: boolean };
};
const initial: T = {
  props: {},
  debug: {},
};

export default Dev.describe('SeekBar', (e) => {
  type LocalStore = Pick<t.ProgressBarProps, 'percent'> & Pick<T['debug'], 'devBg'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.media.SeekBar');
  const local = localstore.object({
    percent: DEFAULTS.percent,
    devBg: false,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.percent = local.percent;
      d.debug.devBg = local.devBg;
    });

    ctx.subject
      .backgroundColor(1)
      .size('fill-x')
      .display('grid')
      .render<T>((e) => {
        const { debug, props } = e.state;

        ctx.subject.backgroundColor(debug.devBg ? 1 : 0);

        return (
          <SeekBar
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
      return <Dev.Object name={'SeekBar'} data={data} expand={1} />;
    });
  });
});

import { Dev, type t } from '../../test.ui';
import { SeekBar } from '.';

const DEFAULTS = SeekBar.DEFAULTS;

type T = {
  props: t.SeekBarProps;
  debug: { devBg?: boolean };
};
const initial: T = {
  props: {},
  debug: {},
};

export default Dev.describe('SeekBar', (e) => {
  type LocalStore = Pick<t.SeekBarProps, 'progress'> & Pick<T['debug'], 'devBg'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.media.SeekBar');
  const local = localstore.object({
    progress: DEFAULTS.progress,
    devBg: false,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.progress = local.progress;
      d.debug.devBg = local.devBg;
    });

    ctx.subject
      .backgroundColor(1)
      .size([500, null])
      .display('grid')
      .render<T>((e) => {
        const { debug, props } = e.state;

        ctx.subject.backgroundColor(debug.devBg ? 1 : 0);

        return (
          <SeekBar
            {...props}
            onClick={(e) => {
              console.info('⚡️ onClick', e);
              state.change((d) => (d.props.progress = e.progress));
            }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.section('Properties', (dev) => {
      const progress = (value: number) => {
        dev.button((btn) => {
          btn
            .label(`progress: ${value}`)
            .right((e) => (e.state.props.progress === value ? '←' : ''))
            .onClick((e) => e.change((d) => (local.progress = d.props.progress = value)));
        });
      };
      progress(0);
      dev.hr(-1, 5);
      progress(0.25);
      progress(0.9);
      dev.hr(-1, 5);
      progress(1);
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

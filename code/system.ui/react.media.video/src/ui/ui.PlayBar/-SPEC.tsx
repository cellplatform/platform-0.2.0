import { Dev, type t } from '../../test.ui';
import { PlayBar } from '.';

type T = {
  props: t.PlayBarProps;
  debug: { devBg?: boolean };
};
const initial: T = {
  props: {},
  debug: {},
};

export default Dev.describe('PlayBar', (e) => {
  /**
   * LocalStorage
   */
  type LocalStore = Pick<T['debug'], 'devBg'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.concept.PlayBar');
  const local = localstore.object({
    devBg: false,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.debug.devBg = local.devBg;
    });

    ctx.subject
      .backgroundColor(1)
      .size('fill-x')
      .display('grid')
      .render<T>((e) => {
        const { debug } = e.state;
        ctx.subject.backgroundColor(debug.devBg ? 1 : 0);
        const margin = debug.devBg ? 5 : 0;

        return <PlayBar {...e.state.props} style={{ margin }} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

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
      return <Dev.Object name={'PlayBar'} data={data} expand={1} />;
    });
  });
});

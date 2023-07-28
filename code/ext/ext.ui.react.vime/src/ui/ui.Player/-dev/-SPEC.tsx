import { Dev, type t } from '../../../test.ui';
import { Root } from '..';

type T = {
  props: t.RootProps;
  debug: { devWidth?: number };
};
const initial: T = {
  props: {},
  debug: {},
};

/**
 * Vime Docs:
 * https://vimejs.com/
 */
export default Dev.describe('Player', (e) => {
  type LocalStore = Pick<T['debug'], 'devWidth'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:ext.ui.react.vime.Player');
  const local = localstore.object({
    devWidth: 500,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.debug.devWidth = local.devWidth;
    });

    ctx.subject
      .backgroundColor(1)
      // .size([500, null])
      .display('grid')
      .render<T>((e) => {
        const { debug, props } = e.state;
        ctx.subject.size([debug.devWidth, null]);
        return <Root {...props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const ctx = dev.ctx;
    const state = await dev.state();
    dev.TODO();

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      //

      const width = (width: number) => {
        dev.button((btn) => {
          btn
            .label(`width: ${width}`)
            .right((e) => (e.state.debug.devWidth === width ? `←` : ''))
            .onClick((e) => {
              e.change((d) => (local.devWidth = d.debug.devWidth = width));
            });
        });
      };

      width(500);
      width(300);
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={'VimePlayer'} data={data} expand={1} />;
    });
  });
});

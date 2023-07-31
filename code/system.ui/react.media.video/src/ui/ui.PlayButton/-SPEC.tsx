import { Dev, type t } from '../../test.ui';
import { PlayButton } from '.';

type T = { props: t.PlayButtonProps };
const initial: T = { props: {} };

export default Dev.describe('PlayButton', (e) => {
  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);
    const state = await ctx.state<T>(initial);
    await state.change((d) => {});
    ctx.subject
      .backgroundColor(1)
      // .size('fill')
      .display('grid')
      .render<T>((e) => {
        return <PlayButton {...e.state.props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.TODO();
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={'PlayButton'} data={data} expand={1} />;
    });
  });
});

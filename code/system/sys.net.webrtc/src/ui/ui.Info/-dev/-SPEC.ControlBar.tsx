import { Dev } from '../../../test.ui';
import { ControlBar, ControlBarProps } from '../ui.ControlBar';

type T = { props: ControlBarProps };
const initial: T = { props: {} };

export default Dev.describe('ControlBar', (e) => {
  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    ctx.subject
      .backgroundColor(1)
      .size([null, 16])
      .display('grid')
      .render<T>((e) => {
        return <ControlBar {...e.state.props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={'ControlBar'} data={data} expand={1} />;
    });
  });
});

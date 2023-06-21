import { Dev } from '../../../test.ui';
import { Connect, type ConnectProps } from '..';

type T = { props: ConnectProps };
const initial: T = { props: { autoload: false } };

export default Dev.describe('Connect', (e) => {
  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    ctx.subject
      .backgroundColor(1)
      .display('grid')
      .render<T>((e) => {
        return <Connect {...e.state.props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.TODO();
    dev.button('load', (e) => e.change((d) => (d.props.autoload = true)));
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={'Connect'} data={data} expand={1} />;
    });
  });
});

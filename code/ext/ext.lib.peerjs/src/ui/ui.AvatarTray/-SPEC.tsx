import { Dev, type t, Webrtc } from '../../test.ui';
import { Root } from '.';
import { Connector } from '../ui.Connector';

type T = { props: t.AvatarTrayProps };
const initial: T = { props: {} };
const name = Root.displayName ?? '';

export default Dev.describe(name, (e) => {
  const self = Webrtc.peer();

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {});

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      // .size('fill')
      .display('grid')
      .render<T>((e) => {
        return <Root {...e.state.props} />;
      });
  });

  e.it('ui:header', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.header
      .padding(0)
      .border(-0.1)
      .render((e) => {
        return <Connector peer={self} />;
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
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});

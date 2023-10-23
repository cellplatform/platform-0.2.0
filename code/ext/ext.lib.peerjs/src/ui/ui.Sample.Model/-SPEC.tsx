import { Dev, Id, Webrtc } from '../../test.ui';
import { Root } from './Root';

type T = {};
const initial: T = {};

/**
 * Spec
 */
const name = 'SampleModel';

export default Dev.describe(name, (e) => {
  const peerA = Webrtc.peer({ peerid: `a-${Id.slug()}` });
  const peerB = Webrtc.peer({ peerid: `b-${Id.slug()}` });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {});

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .display('grid')
      .render<T>((e) => {
        return <Root peerA={peerA} peerB={peerB} />;
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

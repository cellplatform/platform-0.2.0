import { PeerCard } from '.';
import { Dev, Webrtc } from '../../test.ui';
import { Sample } from './-SPEC.Sample';

type T = {};
const initial: T = {};

/**
 * Spec
 */
const name = 'dev.PeerCard';
export default Dev.describe(name, (e) => {
  const peerA = Webrtc.peer();
  const peerB = Webrtc.peer();
  const peerC = Webrtc.peer();

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
        return <Sample peerA={peerA} peerB={peerB} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
    });

    dev.hr(5, 20);

    dev.row((e) => <PeerCard peer={{ self: peerC, remote: peerA }} />);
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

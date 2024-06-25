import { PeerCard } from '.';
import { type t, Dev, Webrtc, Time } from '../../test.ui';
import { Sample } from './-SPEC.Sample';

type TMeta = t.PeerConnectMetadata & { msg: string };
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

    const events = {
      peerA: peerA.events(),
      peerB: peerB.events(),
      peerC: peerC.events(),
    } as const;

    events.peerA.cmd.beforeOutgoing$.subscribe(async (e) => {
      e.metadata<TMeta>(async (data) => {
        await Time.wait(50); // NB: Test ensures async lookups can be done to decorate the meta-data.
        data.msg = 'foobar 👋';
      });
    });

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

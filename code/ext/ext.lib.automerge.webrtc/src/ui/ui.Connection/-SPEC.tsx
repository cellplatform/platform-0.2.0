import { Root } from '.';
import { Crdt, Dev, TestDb, Webrtc, type t } from '../../test.ui';

type T = { props: t.ConnectionProps };
const initial: T = { props: {} };
const name = Root.displayName ?? '';

export default Dev.describe(name, async (e) => {
  const create = async (storage: string) => {
    const peer = Webrtc.peer();
    const store = Crdt.WebStore.init({
      storage,
      network: [], // NB: ensure the local "BroadcastNetworkAdapter" is not used so we actually test WebRTC.
    });
    const index = await Crdt.WebStore.index(store);
    return { peer, store, index } as const;
  };

  const left = await create(TestDb.EdgeSample.left.name);
  const right = await create(TestDb.EdgeSample.right.name);

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {});

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size('fill-x')
      .display('grid')
      .render<T>((e) => {
        return <Root {...e.state.props} />;
      });
  });

  e.it('ui:header', (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.header
      .padding(0)
      .border(-0.1)
      .render((e) => <Webrtc.Connector peer={left.peer} />);
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.button('connect', (e) => left.peer.connect.data(right.peer.id));
    dev.button('disconnect', (e) => left.peer.disconnect());
  });

  e.it('ui:footer', (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .padding(0)
      .border(-0.1)
      .render((e) => <Webrtc.Connector peer={right.peer} />);
  });
});

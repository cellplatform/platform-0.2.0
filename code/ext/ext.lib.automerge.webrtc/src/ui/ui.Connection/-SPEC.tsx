import { Root } from '.';
import { Crdt, Dev, TestDb, Webrtc, WebrtcStore, type t } from '../../test.ui';

type T = { props: t.ConnectionProps };
const initial: T = { props: {} };

const create = async (kind: t.ConnectionEdgeKind) => {
  const peer = Webrtc.peer();
  const db = TestDb.EdgeSample.edge(kind);
  const store = Crdt.WebStore.init({
    storage: db.name,
    network: [], // NB: ensure the local "BroadcastNetworkAdapter" is not used so we actually test WebRTC.
  });
  const index = await Crdt.WebStore.index(store);
  const network = await WebrtcStore.init(peer, store, index);
  const edge: t.ConnectionEdge = { kind, network };
  return edge;
};

const name = Root.displayName ?? '';
export default Dev.describe(name, async (e) => {
  const left = await create('Left');
  const right = await create('Right');

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
        return <Root {...e.state.props} left={left} right={right} />;
      });
  });

  e.it('ui:header', (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.header
      .padding(0)
      .border(-0.1)
      .render((e) => <Webrtc.Connector peer={left.network.peer} />);
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Peers', (dev) => {
      dev.button('connect', (e) => left.network.peer.connect.data(right.network.peer.id));
      dev.button('disconnect', (e) => left.network.peer.disconnect());
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
      dev.hr(-1, 5);

      const sendButton = (edge: t.ConnectionEdge) => {
        dev.button(`send data from "${edge.kind}"`, (e) => {
          type T = { count?: number };
          edge.network.ephemeral.change((d) => {
            const data = d as T;
            data.count = data.count ? data.count + 1 : 1;
          });
        });
      };
      sendButton(left);
      sendButton(right);
    });
  });

  e.it('ui:footer', (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .padding(0)
      .border(-0.1)
      .render((e) => <Webrtc.Connector peer={right.network.peer} />);
  });
});

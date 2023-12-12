import { Connection } from '.';
import { Crdt, Dev, TestDb, Webrtc, WebrtcStore, type t } from '../../test.ui';

type T = {
  props: t.ConnectionProps;
  debug: { count: number; debugBg?: boolean };
};
const initial: T = {
  props: {},
  debug: { count: 0 },
};

const createEdge = async (kind: t.ConnectionEdgeKind) => {
  const db = TestDb.EdgeSample.edge(kind);
  const peer = Webrtc.peer();
  const store = Crdt.WebStore.init({
    storage: db.name,
    network: [], // NB: ensure the local "BroadcastNetworkAdapter" is not used so we actually test WebRTC.
  });
  const index = await Crdt.WebStore.index(store);
  const network = await WebrtcStore.init(peer, store, index);
  const edge: t.ConnectionEdge = { kind, network };
  return edge;
};

const name = Connection.displayName ?? '';
export default Dev.describe(name, async (e) => {
  const left = await createEdge('Left');
  const right = await createEdge('Right');

  type LocalStore = Pick<T['debug'], 'debugBg'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:ext.lib.automerge.webrtc');
  const local = localstore.object({
    debugBg: true,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.debug.debugBg = local.debugBg;
    });

    const monitorPeer = (edge: t.ConnectionEdge) => {
      const peer = edge.network.peer.events();
      peer.cmd.conn$.subscribe((e) => dev.redraw('debug'));
    };
    monitorPeer(left);
    monitorPeer(right);

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size('fill-x')
      .display('grid')
      .render<T>((e) => {
        const debugBg = local.debugBg;
        ctx.subject.backgroundColor(!!debugBg ? 1 : 0);

        return (
          <Connection
            {...e.state.props}
            left={left}
            right={right}
            style={{ MarginY: debugBg ? 20 : 0 }}
          />
        );
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
      const connect = () => left.network.peer.connect.data(right.network.peer.id);
      const disconnect = () => left.network.peer.disconnect();
      const isConnected = () => left.network.peer.current.connections.length > 0;

      dev.button((btn) => {
        btn
          .label(() => (isConnected() ? 'connected' : 'connect'))
          .right((e) => (!isConnected() ? '🌳' : ''))
          .enabled((e) => !isConnected())
          .onClick((e) => connect());
      });
      dev.button((btn) => {
        btn
          .label(() => (isConnected() ? 'disconnect' : 'not connected'))
          .right((e) => (isConnected() ? '💥' : ''))
          .enabled((e) => isConnected())
          .onClick((e) => disconnect());
      });
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());

      dev.hr(-1, 5);

      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.debug.debugBg);
        btn
          .label((e) => `background`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.debugBg = Dev.toggle(d.debug, 'debugBg'))));
      });
      dev.hr(-1, 5);

      const sendButton = (edge: t.ConnectionEdge) => {
        dev.button(`send data from "${edge.kind}"`, (e) => {
          type T = { count?: number };
          edge.network.shared?.change((d) => {
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

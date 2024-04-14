import { PeerRepoList } from '../ui/ui.PeerRepoList';
import { Peer, PeerUI, R, RepoList, TestDb, WebStore, WebrtcStore, type t } from './common';

type K = t.NetworkConnectionEdgeKind;
type B = t.RepoListBehavior[] | (() => t.RepoListBehavior[]);
type N = t.NetworkStore;

/**
 * Root creation factory.
 */
const create = async (kind: K, behaviors?: B): Promise<t.SampleEdge> => {
  /**
   * CRDT and Network objects.
   */
  const db = TestDb.EdgeSample.edge(kind);
  const peer = Peer.init();
  const store = WebStore.init({
    storage: db.name,
    network: [], // NB: ensure the local "BroadcastNetworkAdapter" is not used so we actually test WebRTC.
  });
  const model = await RepoList.model(store, { behaviors });
  const index = model.index;
  const network = await WebrtcStore.init(peer, store, index);
  return { kind, model, network } as const;
};

/**
 * Creation factory returning just the [Edge].
 */
const createEdge = async (kind: K, behaviors?: B) => {
  const { network } = await create(kind, behaviors);
  const edge: t.NetworkConnectionEdge = { kind, network };
  return edge;
};

/**
 * DevHarness: buttons for quick connection of peers (left/right).
 */
const peersSection = (dev: t.DevTools, left: N, right: N) => {
  const connect = () => left.peer.connect.data(right.peer.id);
  const disconnect = () => left.peer.disconnect();
  const isConnected = () => {
    const conns = { left: left.peer.current.connections, right: right.peer.current.connections };
    return conns.left.some((left) => conns.right.some((right) => left.id === right.id));
  };
  dev.button((btn) => {
    btn
      .label(() => (isConnected() ? 'connected' : 'connect'))
      .right(() => (!isConnected() ? '🌳' : ''))
      .enabled(() => !isConnected())
      .onClick(() => connect());
  });
  dev.button((btn) => {
    btn
      .label(() => (isConnected() ? 'disconnect' : 'not connected'))
      .right(() => (isConnected() ? '💥' : ''))
      .enabled(() => isConnected())
      .onClick(() => disconnect());
  });
  return dev;
};

/**
 * Add the <Connector> components to the header/footer of the harness debug panel.
 */
const headerFooterConnectors = (dev: t.DevTools, left: N, right: N) => {
  dev.header
    .padding(0)
    .border(-0.1)
    .render(() => <PeerUI.Connector peer={left.peer} />);

  dev.footer
    .padding(0)
    .border(-0.1)
    .render(() => <PeerUI.Connector peer={right.peer} />);
};

/**
 * Info Panels
 */
type InfoPanelOptions = {
  title?: t.RenderInput | [t.RenderInput, t.RenderInput];
  data?: t.InfoData;
  margin?: t.MarginInput;
};

const infoPanels = (dev: t.DevTools, left: N, right: N, options: InfoPanelOptions = {}) => {
  const render = (network: N) => {
    return dev.row((e) => infoPanel(dev, network, options));
  };
  render(left);
  dev.hr(5, 20);
  render(right);
};

const infoPanel = (dev: t.DevTools, network: N, options: InfoPanelOptions = {}) => {
  const data = R.merge(options.data ?? {}, { network }) as t.InfoData;
  return (
    <PeerRepoList.Info
      title={options.title}
      margin={options.margin}
      fields={['Repo', 'Peer', 'Network.Transfer', 'Network.Shared', 'Network.Shared.Json']}
      data={data}
    />
  );
};

/**
 * Export
 */
export const TestEdge = {
  create,
  createEdge,
  dev: {
    peersSection,
    headerFooterConnectors,
    infoPanel,
    infoPanels,
  },
} as const;

import { PeerRepoList } from '../ui/ui.PeerRepoList';
import { Peer, PeerUI, RepoList, TestDb, WebStore, WebrtcStore, rx, type t } from './common';

type K = t.NetworkConnectionEdgeKind;
type N = t.NetworkStore;
type CreateOptions = {
  behaviors?: t.RepoListBehavior[] | (() => t.RepoListBehavior[]);
  logLevel?: t.LogLevelInput;
  debugLabel?: string;
};

/**
 * Root creation factory.
 */
const create = async (kind: K, options: CreateOptions = {}): Promise<t.SampleEdge> => {
  /**
   * CRDT and Network objects.
   */
  const db = TestDb.EdgeSample.edge(kind);
  const peer = Peer.init();
  const store = WebStore.init({
    storage: db.name,
    network: [], // NB: ensure the local "BroadcastNetworkAdapter" is not used so we actually test WebRTC.
  });
  const { behaviors, logLevel, debugLabel } = options;
  const model = await RepoList.model(store, { behaviors });
  const network = await WebrtcStore.init(peer, store, model.index, { logLevel, debugLabel });
  return { kind, model, network } as const;
};

/**
 * Creation factory returning just the [Edge].
 */
const createEdge = async (kind: K, options?: CreateOptions) => {
  const { network } = await create(kind, options);
  const edge: t.NetworkConnectionEdge = { kind, network };
  return edge;
};

/**
 * Creation factory returning just the [Edge] network.
 */
const createNetwork = async (kind: K, options?: CreateOptions) => {
  const { network } = await create(kind, options);
  return network;
};

/**
 * DevHarness: buttons for quick connection of peers (left/right).
 */
const peersSection = (dev: t.DevTools, left: N, right: N) => {
  const events = { left: left.events(), right: right.events() } as const;
  const $ = rx.merge(events.left.peer.$, events.right.peer.$);
  $.pipe(rx.debounceTime(150)).subscribe(() => dev.redraw('debug'));

  const connect = () => left.peer.connect.data(right.peer.id);
  const disconnect = () => left.peer.disconnect();
  const isConnected = () => {
    const conns = { left: left.peer.current.connections, right: right.peer.current.connections };
    return conns.left.some((left) => conns.right.some((right) => left.id === right.id));
  };

  dev.button((btn) => {
    btn
      .label(() => (isConnected() ? 'connected (top ↑↓ bottom)' : 'connect (top ↑↓ bottom)'))
      .right(() => (!isConnected() ? '⚡️' : ''))
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
  const render = (network: N) => dev.row((e) => infoPanel(dev, network, options));
  render(left);
  dev.hr(5, 20);
  render(right);
};

const infoPanel = (dev: t.DevTools, network: N, options: InfoPanelOptions = {}) => {
  return (
    <PeerRepoList.Info.Stateful
      title={options.title}
      margin={options.margin}
      fields={['Repo', 'Peer', 'Network.Transfer', 'Network.Shared']}
      data={options.data}
      network={network}
    />
  );
};

/**
 * Export
 */
export const TestEdge = {
  create,
  createEdge,
  createNetwork,
  dev: {
    peersSection,
    headerFooterConnectors,
    infoPanel,
    infoPanels,
  },
} as const;

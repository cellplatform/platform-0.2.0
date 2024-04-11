import { Peer, RepoList, TestDb, WebStore, WebrtcStore, type t } from './common';

type K = t.NetworkConnectionEdgeKind;
type B = t.RepoListBehavior[] | (() => t.RepoListBehavior[]);

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
const peersSection = (dev: t.DevTools, left: t.NetworkStore, right: t.NetworkStore) => {
  const connect = () => left.peer.connect.data(right.peer.id);
  const disconnect = () => left.peer.disconnect();
  const isConnected = () => left.peer.current.connections.length > 0;
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
  return dev;
};

/**
 * Export
 */
export const TestEdge = {
  create,
  createEdge,
  peersSection,
} as const;

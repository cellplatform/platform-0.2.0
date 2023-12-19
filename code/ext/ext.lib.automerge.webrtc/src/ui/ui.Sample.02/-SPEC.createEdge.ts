import { Peer, RepoList, TestDb, WebStore, WebrtcStore } from '../../test.ui';
import { type t } from './common';

export const createEdge = async (kind: t.NetworkConnectionEdgeKind) => {
  const db = TestDb.EdgeSample.edge(kind);
  const peer = Peer.init();
  const store = WebStore.init({
    storage: db.name,
    network: [], // NB: ensure the local "BroadcastNetworkAdapter" is not used so we actually test WebRTC.
  });
  const model = await RepoList.model(store);
  const network = await WebrtcStore.init(peer, store, model.index, { debugLabel: kind });
  const edge: t.SampleEdge = { kind, model, network };
  return edge;
};

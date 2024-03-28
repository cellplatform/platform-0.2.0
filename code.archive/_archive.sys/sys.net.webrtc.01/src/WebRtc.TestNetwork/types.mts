import { type t } from './common';

export type TestNetworkP2P = t.Disposable & {
  peerA: t.Peer;
  peerB: t.Peer;
  connect(kind?: t.PeerConnectionKind[]): Promise<void>;
};

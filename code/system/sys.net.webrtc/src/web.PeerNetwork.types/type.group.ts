import { t } from './common';

export type GroupPeer = {
  peer: t.PeerId;
  module: t.PeerModule;
  connections: {
    id: t.PeerConnectionId;
    kind: t.PeerConnectionKind;
    parent?: t.PeerConnectionId;
  }[];
};

export type GroupPeerStatus = {
  local: GroupPeer;
  remote: GroupPeer[];
  pending: GroupPeerConnection[];
};

export type GroupPeerConnection = {
  peer: t.PeerId;
  connection: t.PeerConnectionId;
  kind: t.PeerConnectionKind;
  parent?: t.PeerConnectionId;
};

import { type t } from './common';

export type DevPeerCtx = {
  peerid: { local: string; remote: string };
  options?: t.PeerOptions;
};

export type DevPeerLocalStore = {
  localPeer: string;
  remotePeer: string;
};

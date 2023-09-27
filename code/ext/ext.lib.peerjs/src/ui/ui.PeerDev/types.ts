import { type t } from './common';

export type PeerDevCtx = {
  peerid: { local: string; remote: string };
  options?: t.PeerOptions;
};

export type PeerDevLocalStore = {
  localPeer: string;
  remotePeer: string;
};

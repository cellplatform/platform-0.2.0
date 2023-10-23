import { type t } from './common';

export type PeerDevCtx = {
  peerid: { local: string; remote: string };
  options?: t.PeerJsOptions;
};

export type PeerDevLocalStore = {
  localPeer: string;
  remotePeer: string;
};

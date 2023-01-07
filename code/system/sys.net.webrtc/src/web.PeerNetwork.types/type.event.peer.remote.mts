import { t } from './common';

/**
 * Investigate remote peers
 */
export type PeerRemoteEvent = PeerRemoteExistsReqEvent | PeerRemoteExistsResEvent;

/**
 * Determine if a remote peer currently exists (is alive).
 */
export type PeerRemoteExistsReqEvent = {
  type: 'sys.net/peer/remote/exists:req';
  payload: PeerRemoteExistsReq;
};
export type PeerRemoteExistsReq = {
  self: t.PeerId;
  remote: t.PeerId;
  tx: string;
};

export type PeerRemoteExistsResEvent = {
  type: 'sys.net/peer/remote/exists:res';
  payload: PeerRemoteExistsRes;
};
export type PeerRemoteExistsRes = {
  self: t.PeerId;
  remote: t.PeerId;
  tx: string;
  exists: boolean;
  error?: string;
};

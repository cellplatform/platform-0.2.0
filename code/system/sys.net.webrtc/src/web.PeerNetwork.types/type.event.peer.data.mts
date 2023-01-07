import { t } from './common';

export type PeerDataEvent = PeerDataOutReqEvent | PeerDataOutResEvent | PeerDataInEvent;

/**
 * Fires to sends OUTGOING data over the network
 */
export type PeerDataOutReqEvent = {
  type: 'sys.net/peer/data/out:req';
  payload: PeerDataOutReq;
};
export type PeerDataOutReq = {
  self: t.PeerId;
  targets?: t.PeerConnectionUriString[];
  data: any;
  tx?: string;
};

export type PeerDataOutResEvent = {
  type: 'sys.net/peer/data/out:res';
  payload: PeerDataOutRes;
};
export type PeerDataOutRes = {
  self: t.PeerId;
  sent: { peer: t.PeerId; connection: t.PeerConnectionId }[];
  data: any;
  tx: string;
};

/**
 * Fires when INCOMING data is recieved from the network.
 */
export type PeerDataInEvent = {
  type: 'sys.net/peer/data/in';
  payload: PeerDataIn;
};
export type PeerDataIn = {
  self: t.PeerId;
  data: any;
  source: { peer: t.PeerId; connection: t.PeerConnectionId };
};

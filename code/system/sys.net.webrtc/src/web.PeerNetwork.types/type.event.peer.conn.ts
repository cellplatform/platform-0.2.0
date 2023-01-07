import { t } from './common';

/**
 * Network CONNECTION
 */
export type PeerConnectionEvent =
  | PeerConnectReqEvent
  | PeerConnectResEvent
  | PeerDisconnectReqEvent
  | PeerDisconnectResEvent;

/**
 * Fired to initiate a data connection.
 */
export type PeerConnectReqEvent = {
  type: 'sys.net/peer/conn/connect:req';
  payload: PeerConnectReq;
};
export type PeerConnectReq = PeerConnectDataReq | PeerConnectMediaReq;

type ConnectBase = {
  self: t.PeerId;
  remote: t.PeerId;
  direction: t.PeerConnectDirection;
  parent?: t.PeerConnectionId; // A parent relationship to the conneciton that spawned this connection.
  tx?: string;
};

export type PeerConnectDataReq = ConnectBase & {
  kind: t.PeerConnectionKindData;
  isReliable?: boolean;
};
export type PeerConnectMediaReq = ConnectBase & {
  kind: t.PeerConnectionKindMedia;
  constraints?: t.PeerMediaConstraints;
  timeout?: number;
};

/**
 * Fired when a peer completes it's connection.
 */
export type PeerConnectResEvent = {
  type: 'sys.net/peer/conn/connect:res';
  payload: PeerConnectRes;
};
export type PeerConnectRes = {
  self: t.PeerId;
  remote: t.PeerId;
  existing: boolean;
  kind: t.PeerConnectionKind;
  direction: t.PeerConnectDirection;
  connection?: t.PeerConnectionStatus;
  error?: t.PeerError;
  tx: string;
};

/**
 * Fired to close a connection.
 */
export type PeerDisconnectReqEvent = {
  type: 'sys.net/peer/conn/disconnect:req';
  payload: PeerDisconnectReq;
};
export type PeerDisconnectReq = {
  self: t.PeerId;
  remote: t.PeerId;
  connection: t.PeerConnectionId;
  tx?: string;
};

/**
 * Fires when a "disconnect" request completes.
 * NB:
 *    The generic "connection:closed" request will also
 *    fire upon completing.
 */
export type PeerDisconnectResEvent = {
  type: 'sys.net/peer/conn/disconnect:res';
  payload: PeerDisconnectRes;
};
export type PeerDisconnectRes = {
  self: t.PeerId;
  connection?: t.PeerConnectionId;
  error?: t.PeerError;
  tx: string;
};

import { t } from './common';

type Milliseconds = number;

/**
 * NETWORK
 */
export type PeerLocalEvent =
  | PeerLocalInitReqEvent
  | PeerLocalInitResEvent
  | PeerLocalStatusReqEvent
  | PeerLocalStatusResEvent
  | PeerLocalStatusChangedEvent
  | PeerLocalStatusRefreshEvent
  | PeerLocalOnlineChangedEvent
  | PeerLocalPurgeReqEvent
  | PeerLocalPurgeResEvent
  | PeerLocalMediaReqEvent
  | PeerLocalMediaResEvent;

/**
 * Fires to initiate the creation of a Peer.
 */
export type PeerLocalInitReqEvent = {
  type: 'sys.net/peer/local/init:req';
  payload: PeerLocalCreateReq;
};
export type PeerLocalCreateReq = {
  self: t.PeerId;
  signal: string; // String containing the signal server endpoint: "host/path"
  timeout?: Milliseconds;
};

/**
 * Fires when a peer has connected.
 */
export type PeerLocalInitResEvent = {
  type: 'sys.net/peer/local/init:res';
  payload: PeerLocalInitRes;
};
export type PeerLocalInitRes = {
  self: t.PeerId;
  createdAt: number;
  signal: t.PeerSignallingEndpoint;
  error?: t.PeerError;
};

/**
 * Fired to retrieve the status of the specified peer.
 */
export type PeerLocalStatusReqEvent = {
  type: 'sys.net/peer/local/status:req';
  payload: PeerLocalStatusReq;
};
export type PeerLocalStatusReq = {
  self: t.PeerId;
  tx?: string;
};

/**
 * Fired to retrieve the status of the specified peer.
 */
export type PeerLocalStatusResEvent = {
  type: 'sys.net/peer/local/status:res';
  payload: PeerLocalStatusRes;
};
export type PeerLocalStatusRes = {
  self: t.PeerId;
  tx: string;
  exists: boolean;
  peer?: t.PeerStatus;
};

/**
 * Fired when the status of a peer network has changed.
 *
 * NOTE:
 *    This is a derived event that is fired in response
 *    to various different events completing that indicate
 *    the status of the [PeerNetwork] has changed.
 *
 *    Example usage: redrawing UI that may be displaying
 *    the status of the network.
 *
 */
export type PeerLocalStatusChangedEvent = {
  type: 'sys.net/peer/local/status:changed';
  payload: PeerLocalStatusChanged;
};
export type PeerLocalStatusChanged = {
  self: t.PeerId;
  peer: t.PeerStatus;
  event: t.PeerEvent;
};

/**
 * Fired to force the "status:changed" event.
 */
export type PeerLocalStatusRefreshEvent = {
  type: 'sys.net/peer/local/status:refresh';
  payload: PeerLocalStatusRefresh;
};
export type PeerLocalStatusRefresh = {
  self: t.PeerId;
};

/**
 * Fires when the online (network connectivity) status changes.
 */
export type PeerLocalOnlineChangedEvent = {
  type: 'sys.net/peer/local/online:changed';
  payload: PeerLocalOnlineChanged;
};
export type PeerLocalOnlineChanged = {
  self: t.PeerId;
  isOnline: boolean;
};

/**
 * Purges obsolete state.
 */
export type PeerLocalPurgeReqEvent = {
  type: 'sys.net/peer/local/purge:req';
  payload: PeerLocalPurgeReq;
};
export type PeerLocalPurgeReq = {
  self: t.PeerId;
  tx?: string;
  select?: true | { closedConnections?: boolean }; // NB: [true] clears all purgeable data.
};

export type PeerLocalPurgeResEvent = {
  type: 'sys.net/peer/local/purge:res';
  payload: PeerLocalPurgeRes;
};
export type PeerLocalPurgeRes = {
  self: t.PeerId;
  tx: string;
  changed: boolean;
  purged: t.PeerLocalPurged;
  error?: t.PeerError;
};
export type PeerLocalPurged = {
  closedConnections: { data: number; video: number; screen: number };
};

/**
 * Request a media-stream from the local environment.
 */
export type PeerLocalMediaReqEvent = {
  type: 'sys.net/peer/local/media:req';
  payload: PeerLocalMediaReq;
};
export type PeerLocalMediaReq = {
  self: t.PeerId;
  tx?: string;
  kind: t.PeerConnectionKindMedia;
  constraints?: t.PartialDeep<MediaStreamConstraints>;
};

/**
 * Response to a media-stream request.
 */
export type PeerLocalMediaResEvent = {
  type: 'sys.net/peer/local/media:res';
  payload: PeerLocalMediaRes;
};
export type PeerLocalMediaRes = {
  self: t.PeerId;
  tx: string;
  kind: t.PeerConnectionKindMedia;
  media?: MediaStream;
  error?: t.PeerError;
};

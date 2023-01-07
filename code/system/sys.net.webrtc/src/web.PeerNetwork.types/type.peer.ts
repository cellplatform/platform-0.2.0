import { t } from './common';

export type PeerId = string; // An identifier of a network peer.
export type PeerConnectionId = string;
export type PeerMediaConstraints = t.PartialDeep<MediaStreamConstraints>;
export type PeerError = { message: string };
export type PeerModule = { name: string; version: string };

/**
 * Status
 */
export type PeerStatus = {
  id: t.PeerId;
  isOnline: boolean;
  createdAt: number;
  signal: t.PeerSignallingEndpoint;
  connections: t.PeerConnectionStatus[];
};

export type PeerStatusObject = {
  $: t.Observable<t.PeerStatus>;
  current: t.PeerStatus;
};

/**
 * Connection broker end-point.
 */
export type PeerSignallingEndpoint = {
  host: string;
  port: number;
  path?: string;
  secure: boolean;
  key: string;
  url: { base: string; peers: string };
};

/**
 * Filter on a peer connection.
 */
export type PeerFilter = (e: PeerFilterArgs) => boolean;
export type PeerFilterArgs = {
  peer: t.PeerId;
  connection: { id: t.PeerConnectionId; kind: t.PeerConnectionKind };
};

/**
 * PeerNetwork Controller
 */
export type PeerController = t.Disposable & {
  events: t.PeerEvents;
};

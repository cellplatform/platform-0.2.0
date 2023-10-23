import type { DataConnection, MediaConnection } from 'peerjs';

/**
 * @external
 */
export type PeerJsConn = DataConnection | MediaConnection;
export type {
  DataConnection as PeerJsConnData,
  MediaConnection as PeerJsConnMedia,
  Peer as PeerJs,
  PeerOptions as PeerJsOptions,
} from 'peerjs';

/**
 * @system
 */
export type * from './Webrtc/types';
export type * from './Webrtc.PeerModel/types';

export type * from './ui/ui.Connector/types';
export type * from './ui/ui.Dev/types';
export type * from './ui/ui.Info/types';

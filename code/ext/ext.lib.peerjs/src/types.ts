import type { DataConnection, MediaConnection } from 'peerjs';

/**
 * @external
 */
export type PeerJsConn = DataConnection | MediaConnection;
export type {
  Peer as PeerJs,
  DataConnection as PeerJsConnData,
  MediaConnection as PeerJsConnMedia,
  PeerOptions as PeerJsOptions,
} from 'peerjs';

/**
 * @system
 */
export type * from './Webrtc.PeerJs/types';
export type * from './Webrtc.Peer/types';
export type * from './Webrtc/types';

export type * from './ui/ui.Connector.MediaToolbar/types';
export type * from './ui/ui.Connector.Model/types';
export type * from './ui/ui.Connector/types';
export type * from './ui/ui.Dev/types';
export type * from './ui/ui.Info/types';

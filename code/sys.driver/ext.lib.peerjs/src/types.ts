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
export type * from './Webrtc.Peer/t';
export type * from './Webrtc.PeerJs/t';
export type * from './Webrtc/t';

export type * from './ui/ui.AvatarTray/t';
export type * from './ui/ui.Button.PeerUri/t';
export type * from './ui/ui.Connector.MediaToolbar/t';
export type * from './ui/ui.Connector.Model/t';
export type * from './ui/ui.Connector/t';
export type * from './ui/ui.Dev.PeerCard/t';
export type * from './ui/ui.Info/t';
export type * from './ui/ui.Video/t';

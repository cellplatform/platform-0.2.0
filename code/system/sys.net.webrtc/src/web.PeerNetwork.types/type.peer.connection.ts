import { t } from './common';

export type PeerConnectionKind = PeerConnectionKindData | PeerConnectionKindMedia;
export type PeerConnectionKindData = 'data';
export type PeerConnectionKindMedia = 'media/video' | 'media/screen';
export type PeerConnectDirection = 'incoming' | 'outgoing';

/**
 * Connection status.
 */
export type PeerConnectionStatus = PeerConnectionDataStatus | PeerConnectionMediaStatus;

type ConnectionBase = {
  peer: { self: t.PeerId; remote: { id: t.PeerId; module: t.PeerModule; userAgent: string } };
  id: t.PeerConnectionId;
  uri: t.PeerConnectionUriString;
  direction: t.PeerConnectDirection;
  parent?: t.PeerConnectionId;
};

export type PeerConnectionDataStatus = ConnectionBase & {
  kind: 'data';
  isReliable: boolean;
  isOpen: boolean;
  metadata?: t.PeerConnectionMetadataData;
};

export type PeerConnectionMediaStatus = ConnectionBase & {
  kind: 'media/screen' | 'media/video';
  isOpen: boolean;
  media?: MediaStream;
  metadata?: t.PeerConnectionMetadataMedia;
};

/**
 * Connection {metadata}.
 */
export type PeerConnectionMetadata = PeerConnectionMetadataData | PeerConnectionMetadataMedia;

export type PeerConnectionMetadataData = {
  kind: t.PeerConnectionKindData;
  module: t.PeerModule;
  userAgent: string;
  parent?: t.PeerConnectionId;
};

export type PeerConnectionMetadataMedia = {
  kind: t.PeerConnectionKindMedia;
  module: t.PeerModule;
  userAgent: string;
  constraints?: t.PeerMediaConstraints;
  parent?: t.PeerConnectionId;
};

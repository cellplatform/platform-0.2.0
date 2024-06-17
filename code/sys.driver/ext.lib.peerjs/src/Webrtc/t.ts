import type { t } from './common';

/**
 * Wrapper for working with PeerJS
 */
export type Webrtc = {
  readonly Is: t.PeerIs;
  readonly PeerJs: t.WebrtcPeerJs;
  readonly PeerUri: t.WebrtcPeerUri;
  readonly Peer: t.WebrtcPeer;
  readonly peer: t.WebrtcPeer['init'];
};

/**
 * Helpers for working with Peer ids.
 */
export type WebrtcPeerUri = {
  readonly Is: PeerIs;
  generate(prefix?: boolean | string): string;
  prepend(uri: string, ...prefix: string[]): string;
  id(input?: string): string;
  uri(input?: string): string;
};

export type PeerIs = {
  peerid(input?: any): boolean;
  uri(input?: any): boolean;
  Kind: {
    data(input: any): input is t.PeerConnectionKindData;
    media(input: any): input is t.PeerConnectionKindMedia;
    video(input: any): input is t.PeerConnectionKindMediaVideo;
    screen(input: any): input is t.PeerConnectionKindMediaScreen;
  };
};

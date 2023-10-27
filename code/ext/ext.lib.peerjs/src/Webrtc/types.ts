import type { t } from './common';

/**
 * Wrapper for working with PeerJS
 */
export type Webrtc = {
  readonly Is: t.WebrtcIs;
  readonly PeerJs: t.WebrtcPeerJs;
  readonly PeerUri: t.WebrtcPeerUri;
  readonly PeerModel: t.WebrtcPeerModel;
  readonly peer: t.WebrtcPeerModel['init'];
};

/**
 * Helpers for working with Peer ids.
 */
export type WebrtcPeerUri = {
  readonly Is: WebrtcIs;
  generate(prefix?: boolean | string): string;
  prepend(uri: string, ...prefix: string[]): string;
  id(input?: string): string;
  uri(input?: string): string;
};

export type WebrtcIs = {
  peerid(input?: any): boolean;
  uri(input?: any): boolean;
  kindData(input: any): input is t.PeerConnectionDataKind;
  kindMedia(input: any): input is t.PeerConnectionMediaKind;
};

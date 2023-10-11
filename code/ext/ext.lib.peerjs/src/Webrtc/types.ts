import type { t } from './common';

/**
 * Wrapper for working with PeerJS
 */
export type Webrtc = {
  readonly Is: WebrtcIs;
  readonly Peer: WebrtcPeer;
  readonly PeerUri: WebrtcPeerUri;
};

/**
 * Wrapper for working with peers
 */
type OptionsArgs = { host: string; path: string; key: string };
export type WebrtcPeer = {
  readonly Uri: WebrtcPeerUri;
  options(input?: OptionsArgs): t.PeerOptions;
  create(): t.Peer;
  create(options?: OptionsArgs): t.Peer;
  create(peerid: string, options?: OptionsArgs): t.Peer;
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
};

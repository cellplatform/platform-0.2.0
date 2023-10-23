import type { t } from './common';

/**
 * Wrapper for working with PeerJS
 */
export type Webrtc = {
  readonly Is: WebrtcIs;
  readonly PeerJs: WebrtcPeerJs;
  readonly PeerUri: WebrtcPeerUri;
};

/**
 * Wrapper for working with peers
 */
type OptionsArgs = { host: string; path: string; key: string };
export type WebrtcPeerJs = {
  readonly Is: WebrtcIs;
  readonly Uri: WebrtcPeerUri;
  options(input?: OptionsArgs): t.PeerJsOptions;
  create(): t.PeerJs;
  create(options?: OptionsArgs): t.PeerJs;
  create(peerid: string, options?: OptionsArgs): t.PeerJs;
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
};

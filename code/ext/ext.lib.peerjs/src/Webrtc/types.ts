import type { t } from './common';

// /**
//  * Wrapper for working with PeerJS
//  */
// export type WebRtc = {
//   readonly Peer: WebRtcPeer;
// };

/**
 * Wrapper for working with peers
 */
type OptionsArgs = { host: string; path: string; key: string };

export type WebRtcPeer = {
  options(input?: OptionsArgs): t.PeerOptions;
  create(): t.Peer;
  create(options?: OptionsArgs): t.Peer;
  create(peerid: string, options?: OptionsArgs): t.Peer;
};

import type * as t from './types.mjs';
import { WebRTC } from './libs.mjs';

/**
 * Format and place a "peer:<id>" on the clipboard.
 */
export const copyPeer = (peer: t.PeerId | t.PeerUri) => {
  const text = WebRTC.Util.asId(peer);
  navigator.clipboard.writeText(text);
  return text;
};

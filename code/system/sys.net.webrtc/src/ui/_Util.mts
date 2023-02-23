import { t, WebRTC } from './common';

/**
 * Format and place a "peer:<id>" on the clipboard.
 */
export const copyPeer = (peer: t.PeerId | t.PeerUri) => {
  const text = WebRTC.Util.asUri(peer);
  navigator.clipboard.writeText(text);
  return text;
};

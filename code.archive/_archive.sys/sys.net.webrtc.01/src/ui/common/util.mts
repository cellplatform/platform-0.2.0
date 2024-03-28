import { WebRtc } from '../../WebRtc';
import type * as t from './types.mjs';

/**
 * Format and place a "peer:<id>" on the clipboard.
 */
export const copyPeer = (peer: t.PeerId | t.PeerUri) => {
  const text = WebRtc.Util.asId(peer);
  navigator.clipboard.writeText(text);
  return text;
};

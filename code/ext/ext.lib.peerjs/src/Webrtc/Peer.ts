import { DEFAULTS, Path, Peer as PeerJs, cuid, type t } from '../common';
import { PeerUri as Uri } from './Peer.Uri';

export type OptionsArgs = { host: string; path: string; key: string };

/**
 * Helpers for setting up and working with a WebRTC peer.
 * Ref:
 *    https://github.com/peers/peerjs
 */
export const Peer: t.WebrtcPeer = {
  Uri,

  options(input?: OptionsArgs): t.PeerOptions {
    const args = input ?? DEFAULTS.signal;
    const host = Path.trimHttpPrefix(args.host);
    const path = Path.ensureSlashes(args.path);
    const key = args.key;
    const port = 443;
    const secure = true;
    return { host, path, key, port, secure } as const;
  },

  /**
   * Generate a new WebRTC peer.
   */
  create(...args: any[]) {
    if (args.length === 0) return new PeerJs(cuid(), Peer.options());
    if (isObject(args[0])) return new PeerJs(cuid(), args[0]);
    if (typeof args[0] === 'string') {
      const options = isObject(args[1]) ? Peer.options(args[1]) : Peer.options();
      return new PeerJs(args[0], options);
    }
    throw new Error('Could not resolve Peer creation args');
  },
} as const;

/**
 * Helpers
 */
function isObject(input: any) {
  return typeof input === 'object' && input !== null;
}

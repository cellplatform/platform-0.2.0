import { Peer as PeerJsLib } from 'peerjs';
import { DEFAULTS, Path, cuid, type t } from '../common';
import { Is } from './Is';
import { PeerUri as Uri } from './Peer.Uri';

export type OptionsArgs = { host: string; path: string; key: string };

/**
 * Helpers for setting up and working with a WebRTC peer.
 * Ref:
 *    https://github.com/peers/peerjs
 */
export const PeerJs: t.WebrtcPeerJs = {
  Is,
  Uri,

  options(input?: OptionsArgs): t.PeerJsOptions {
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
    if (args.length === 0) return new PeerJsLib(cuid(), PeerJs.options());
    if (isObject(args[0])) return new PeerJsLib(cuid(), args[0]);
    if (typeof args[0] === 'string') {
      const options = isObject(args[1]) ? PeerJs.options(args[1]) : PeerJs.options();
      return new PeerJsLib(args[0], options);
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

import { Peer as PeerJsLib } from 'peerjs';
import { DEFAULTS, Is, Path, PeerUri as Uri, type t } from './common';

/**
 * Helpers for setting up and working with a WebRTC peer.
 * Ref:
 *    https://github.com/peers/peerjs
 */
export const PeerJs: t.WebrtcPeerJs = {
  Is,
  Uri,

  /**
   * Format and flesh-out configuration options.
   */
  options(input?: Partial<t.PeerJsCreateArgs>): t.PeerJsOptions {
    const host = Path.trimHttpPrefix(input?.host ?? DEFAULTS.signal.host);
    const path = Path.ensureSlashes(input?.path ?? DEFAULTS.signal.path);
    const key = input?.key ?? DEFAULTS.signal.key;
    const port = 443;
    const secure = true;
    return { host, path, key, port, secure } as const;
  },

  /**
   * Generate a new WebRTC peer.
   */
  create(...args: any[]) {
    if (args.length === 0) return new PeerJsLib(Uri.generate(false), PeerJs.options());
    if (isObject(args[0])) return new PeerJsLib(Uri.generate(false), PeerJs.options(args[0]));
    if (typeof args[0] === 'string') {
      const id = args[0].trim() || Uri.generate(false);
      const options = isObject(args[1]) ? PeerJs.options(args[1]) : PeerJs.options();
      return new PeerJsLib(id, options);
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

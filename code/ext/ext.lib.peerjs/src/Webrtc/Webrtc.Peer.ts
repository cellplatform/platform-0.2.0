import { Path, type t, DEFAULTS } from '../common';

/**
 * Helpers for setting up and working with a WebRTC peer.
 * Ref:
 *    https://github.com/peers/peerjs
 */
export const Peer = {
  options(input?: { host: string; path: string; key: string }): t.PeerOptions {
    const args = input ?? DEFAULTS.signal;
    const host = Path.trimHttpPrefix(args.host);
    const path = `/${Path.trimSlashes(args.path)}`;
    const key = args.key;
    const port = 443;
    const secure = true;
    return { host, path, key, port, secure } as const;

    /**
     * TODO 🐷
     * change "key" >> "token"
     */
  },
} as const;

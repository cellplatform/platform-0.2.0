import { Path, type t } from '../common';

/**
 * Helpers for setting up and working with a WebRTC peer.
 * Ref:
 *    https://github.com/peers/peerjs
 */
export const Peer = {
  options(args: { host: string; path: string; key: string }): t.PeerOptions {
    const host = Path.trimHttpPrefix(args.host);
    const path = `/${Path.trimSlashes(args.path)}`;
    const key = args.key;
    const port = 443;
    const secure = true;
    return { host, path, key, port, secure };

    /**
     * TODO 🐷
     * change "key" >> "token"
     */
  },
} as const;

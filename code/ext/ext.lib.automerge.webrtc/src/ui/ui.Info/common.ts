import { type t } from '../common';
export * from '../common';
export { Info as PeerInfo } from 'ext.lib.peerjs';

/**
 * Constants
 */
export const DEFAULTS = {
  fields: {
    get all(): t.InfoField[] {
      return ['Module', 'Module.Verify', 'Component', 'Peer', 'Peer.Remotes', 'Repo'];
    },
    get default(): t.InfoField[] {
      return ['Module', 'Module.Verify'];
    },
  },
  query: { dev: 'dev' },
} as const;

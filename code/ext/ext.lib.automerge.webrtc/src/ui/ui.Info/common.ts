import { type t } from '../common';

export { Info as PeerInfo } from 'ext.lib.peerjs';

export * from '../common';
export { usePeerMonitor, useShared, useTransmitMonitor } from '../use';

/**
 * Constants
 */
export const DEFAULTS = {
  fields: {
    get all(): t.InfoField[] {
      return [
        'Module',
        'Module.Verify',
        'Component',
        'Peer',
        'Peer.Remotes',
        'Repo',
        'Network.Shared',
        'Network.Shared.Json',
        'Network.Transfer',
        'Visible',
      ];
    },
    get default(): t.InfoField[] {
      return ['Module', 'Module.Verify'];
    },
  },
  query: { dev: 'dev' },
} as const;

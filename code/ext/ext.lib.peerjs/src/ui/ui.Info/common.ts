import { type t } from '../common';
export * from '../common';

/**
 * Constants
 */
export const DEFAULTS = {
  fields: {
    get all(): t.InfoField[] {
      return ['Module', 'Module.Verify', 'Component', 'Peer', 'Peer.Remotes'];
    },
    get default(): t.InfoField[] {
      return ['Module', 'Module.Verify'];
    },
  },
  query: { dev: 'dev' },
} as const;

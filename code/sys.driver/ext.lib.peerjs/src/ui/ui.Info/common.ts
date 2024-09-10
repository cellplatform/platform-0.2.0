import { Pkg, type t } from '../common';
export * from '../common';

/**
 * Constants
 */
const name = 'Info';

const fields = {
  get all(): t.InfoField[] {
    return ['Module', 'Module.Verify', 'Component', 'Peer', 'Peer.Remotes'];
  },
  get default(): t.InfoField[] {
    return ['Module', 'Module.Verify'];
  },
} as const;

export const DEFAULTS = {
  name,
  displayName: `${Pkg.name}:${name}`,
  fields,
  theme: 'Light',
  query: { dev: 'dev' },
} as const;

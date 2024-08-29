import { Pkg, type t } from '../common';
export { Info as AutomergeInfo } from 'ext.lib.automerge';
export { Info as PeerInfo } from 'ext.lib.peerjs';

export * from '../common';
export { usePeerMonitor, useShared, useTransmitMonitor } from '../use';

/**
 * Constants
 */
const uri: Required<t.InfoDocUri> = {
  shorten: [4, 4],
  prefix: 'crdt:automerge',
  head: true,
  clipboard: true,
};

const fields = {
  get all(): t.InfoField[] {
    return [
      'Visible',
      'Module',
      'Module.Verify',
      'Component',
      'Peer',
      'Peer.Remotes',
      'Repo',
      'Network.Shared',
      'Network.Transfer',
    ];
  },
  get default(): t.InfoField[] {
    return ['Module', 'Module.Verify'];
  },
};

const name = 'Info';
const theme: t.CommonTheme = 'Light';

export const DEFAULTS = {
  name,
  displayName: `${Pkg.name}:${name}`,
  fields,
  doc: { uri },
  shared: { label: 'Shared State', dotMeta: false },
  query: { dev: 'dev' },
  theme,
} as const;

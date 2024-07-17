import { Pkg, type t } from '../common';
export { Info as AutomergeInfo } from 'ext.lib.automerge';
export { Info as PeerInfo } from 'ext.lib.peerjs';

export * from '../common';
export { usePeerMonitor, useShared, useTransmitMonitor } from '../use';

/**
 * Constants
 */
const uri: Required<t.InfoDataDocUri> = {
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

const theme: t.CommonTheme = 'Light';

export const DEFAULTS = {
  displayName: `${Pkg.name}:Info`,
  fields,
  doc: { uri },
  stateful: false,
  shared: { label: 'Shared State', dotMeta: false },
  query: { dev: 'dev' },
  theme,
} as const;

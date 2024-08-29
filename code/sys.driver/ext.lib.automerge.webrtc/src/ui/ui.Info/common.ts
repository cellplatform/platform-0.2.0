import { Pkg, type t } from '../common';
export { Info as AutomergeInfo } from 'ext.lib.automerge';
export { Info as PeerInfo } from 'ext.lib.peerjs';

export * from '../common';
export { usePeerMonitor, useShared, useTransmitMonitor } from '../use';

type P = t.InfoProps;

/**
 * Constants
 */
const name = 'Info';
const props: t.PickRequired<P, 'theme' | 'enabled' | 'fields' | 'childrenStateful'> = {
  theme: 'Light',
  enabled: true,
  childrenStateful: false,
  get fields() {
    return fields.default;
  },
};

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

export const DEFAULTS = {
  name,
  displayName: `${Pkg.name}:${name}`,
  fields,
  props,
  doc: { uri },
  shared: { label: 'Shared State', dotMeta: false },
  query: { dev: 'dev' },
} as const;

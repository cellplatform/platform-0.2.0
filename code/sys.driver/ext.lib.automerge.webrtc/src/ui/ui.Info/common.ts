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
const displayName = `${Pkg.name}:${name}`;
const props: t.PickRequired<P, 'theme' | 'enabled' | 'fields'> = {
  theme: 'Light',
  enabled: true,
  get fields() {
    return fields.default;
  },
};

const address: Required<t.InfoDocAddress> = {
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
  displayName,
  fields,
  props,
  doc: { address },
  shared: { label: 'Shared State', dotMeta: false },
  query: { dev: 'dev' },
  Stateful: { name: `${name}.Stateful`, displayName: `${displayName}.Stateful` },
} as const;

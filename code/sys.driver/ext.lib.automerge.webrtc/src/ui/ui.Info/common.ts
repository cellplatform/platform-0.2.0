import { Pkg, type t } from '../common';
export { Info as CrdtInfo } from 'ext.lib.automerge';
export { Info as PeerInfo } from 'ext.lib.peerjs';

export * from '../common';
export { usePeerMonitor, useTransmitMonitor } from '../use';

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

type F = t.InfoVisible<t.InfoField>['filter'];
const visibleFilter: F = (e) => (e.visible ? e.fields : ['Visible']) as t.InfoField[];
const fields = {
  visibleFilter,
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
    return ['Repo', 'Peer', 'Network.Transfer', 'Network.Shared'];
  },
} as const;

export const DEFAULTS = {
  displayName,
  name,
  fields,
  props,
  repo: 'main',
  query: { dev: 'dev' },
  Stateful: {
    name: `${name}.Stateful`,
    displayName: `${displayName}.Stateful`,
  },
} as const;

import { Value, type t } from './common';

export function fieldPeer(data: t.InfoData): t.PropListItem {
  const self = data.peer?.self;
  const peer = self?.current;

  return {
    label: 'Peer',
    value: peer ? Wrangle.connectionsLabel(peer) : '-',
  };
}

/**
 * Helpers
 */

const Wrangle = {
  connectionsLabel(peer: t.Peer) {
    const total = peer.connections.length;
    return `${total} ${Value.plural(total, 'connection', 'connections')}`;
  },
} as const;

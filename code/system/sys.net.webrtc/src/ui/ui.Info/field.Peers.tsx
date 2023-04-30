import { t, Value } from './common';

export function FieldPeers(
  fields: t.WebRtcInfoField[],
  data: t.WebRtcInfoData,
  info?: t.WebRtcInfo,
): t.PropListItem {
  const self = data.self;
  const peer = self?.peer;
  const label = data.peers?.title ?? 'Group';

  if (!peer || peer.connections.length === 0) {
    return {
      label,
      value: { data: '(empty)', opacity: 0.3 },
    };
  }

  const total = peer.connectionsByPeer.length;
  const item: t.PropListItem = {
    label,
    value: `${total} ${Value.plural(total, 'peer', 'peers')}`,
  };

  return item;
}

import { t } from './common';

export function FieldPeers(
  fields: t.WebRtcInfoFields[],
  data: t.WebRtcInfoData,
  info?: t.WebRtcInfo,
): t.PropListItem {
  const self = data.self;
  const peer = self?.peer;
  const label = data.peers?.title ?? 'Peers';

  if (!peer || peer.connections.length === 0) {
    return {
      label,
      value: { data: '(none)', opacity: 0.3 },
    };
  }

  const item: t.PropListItem = {
    label,
    value: peer.connectionsByPeer.length,
  };

  return item;
}

import { PropList, t, TestRunner, DEFAULTS, Value } from './common';

export function FieldConnections(
  fields: t.WebRtcInfoFields[],
  data: t.WebRtcInfoData,
): t.PropListItem {
  const self = data.self;
  const label = data.connections?.title ?? 'Connections';
  const peer = self?.peer;

  if (!peer || peer.connections.length === 0) {
    const data = fields.includes('Connetions.List') ? '' : '(none)';
    return {
      label,
      value: { data, opacity: 0.3 },
    };
  }

  const connections = peer.connections;

  const item: t.PropListItem = {
    label,
    value: {
      // data: `peer:${Value.shortenHash(peer.id, [5, 5])}`,
      // clipboard: peer.id,
    },
  };

  return item;
}

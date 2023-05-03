import { t, Value, PropList, Icons, DEFAULTS } from '../common';

const { indent } = DEFAULTS;

export function FieldPeer(
  fields: t.WebRtcInfoField[],
  data: t.WebRtcInfoData,
  info?: t.WebRtcInfo,
): t.PropListItem {
  const peer = info?.peer;
  const label = data.peer?.title ?? 'Local Network Peer';

  if (!peer) {
    return {
      label,
      value: { data: '(not specified)', opacity: 0.3 },
    };
  }

  const total = Wrangle.total(info);
  const item: t.PropListItem = {
    label,
    value: `${total} ${Value.plural(total, 'connection', 'connections')}`,
  };

  return item;
}

/**
 * Helpers
 */
const Wrangle = {
  total(info?: t.WebRtcInfo) {
    return info?.peer.connections.length ?? 0;
  },
};

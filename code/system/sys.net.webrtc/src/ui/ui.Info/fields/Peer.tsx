import { t, Value, PropList, Icons } from '../common';

const indent = 15;

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

export function FieldPeerConnections(
  fields: t.WebRtcInfoField[],
  data: t.WebRtcInfoData,
  info?: t.WebRtcInfo,
): t.PropListItem[] {
  const peer = info?.peer;

  // const label = data.peer?.title ?? 'Peer';
  console.log('peer - list', peer);

  if (!peer) return [];

  const p = (text: string, length: number) => text.slice(0, length);

  return peer.connections.all.map((conn) => {
    return {
      label: `local:${p(conn.peer.local, 5)} →`,
      value: `p:${p(conn.peer.remote, 5)}:${conn.kind}:${p(conn.id, 8)}`,
      indent,
    };
  });
}

/**
 * Helpers
 */
const Wrangle = {
  total(info?: t.WebRtcInfo) {
    return info?.peer.connections.length ?? 0;
  },
};

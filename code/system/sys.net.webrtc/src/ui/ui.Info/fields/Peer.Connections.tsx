import { t, Value, PropList, Icons, DEFAULTS } from '../common';

const { indent } = DEFAULTS;

export function FieldPeerConnections(
  fields: t.WebRtcInfoField[],
  data: t.WebRtcInfoData,
  info?: t.WebRtcInfo,
): t.PropListItem[] {
  const peer = info?.peer;


  if (!peer) return [];

  const p = (text: string, length: number) => text.slice(0, length);

  return peer.connections.all.map((conn) => {
    return {
      label: `local:p:${p(conn.peer.local, 5)} →`,
      value: `p:${p(conn.peer.remote, 5)}:${conn.kind}:${p(conn.id, 8)}`,
      indent,
    };
  });
}

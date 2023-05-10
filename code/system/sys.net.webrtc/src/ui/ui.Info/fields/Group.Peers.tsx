import { t } from '../common';
import { PeerRow } from '../ui.PeerRow';

export function FieldGroupList(
  fields: t.WebRtcInfoField[],
  data: t.WebRtcInfoData,
  info?: t.WebRtcInfo,
): t.PropListItem[] {
  const peer = info?.peer;
  const state = info?.state;

  if (!state || !peer) {
    return [];
  }

  const network = state.current.network;
  const local = Object.values(network.peers).find((e) => e.id === peer.id);
  const remotes = Object.values(network.peers)
    .filter((e) => e.id !== peer.id)
    .filter(Boolean);
  if (!local) return [];

  const render = (data: t.NetworkStatePeer, options: { isSelf?: boolean } = {}): t.PropListItem => {
    const { isSelf } = options;
    const value = <PeerRow self={peer} data={data} selected={isSelf} style={{ marginLeft: 5 }} />;
    return { value };
  };

  const items: t.PropListItem[] = [render(local, { isSelf: true })];
  remotes.forEach((data) => items.push(render(data)));
  return items;
}

import { Crdt, PropList, t, Value, DEFAULTS } from '../common';
import { Video } from '../ui.Video';
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

  const render = (data: t.NetworkStatePeer): t.PropListItem => {
    const marginLeft = DEFAULTS.indent;
    const value = <PeerRow self={peer} state={data} style={{ marginLeft }} />;
    return { value };
  };

  const items: t.PropListItem[] = [render(local)];
  remotes.forEach((data) => items.push(render(data)));

  console.log('items', items);
  return items;

}

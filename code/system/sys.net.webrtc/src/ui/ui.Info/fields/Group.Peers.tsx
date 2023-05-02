import { Crdt, PropList, t, Value } from '../common';
import { Video } from '../ui.Video';
import { PeerRow } from '../ui.PeerRow';

export function FieldGroupList(
  fields: t.WebRtcInfoField[],
  data: t.WebRtcInfoData,
  info?: t.WebRtcInfo,
): t.PropListItem[] {
  const indent = 15;
  const peer = info?.peer;
  const state = info?.state;

  if (!state || !peer || peer.connections.length === 0) {
    return [];
  }

  const network = state.current.network;
  const local = Object.values(network.peers).find((e) => e.id === peer.id);
  const remotes = Object.values(network.peers).filter((e) => e.id !== peer.id);

  return [local, ...remotes].filter(Boolean).map((data) => {
    const item: t.PropListItem = {
      value: <PeerRow self={peer} state={data!} style={{ marginLeft: indent }} />,
    };
    return item;
  });

}

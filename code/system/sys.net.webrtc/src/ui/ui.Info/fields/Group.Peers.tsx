import { t } from '../common';
import { PeerRow } from '../ui.PeerRow';

export function FieldGroupList(
  fields: t.WebRtcInfoField[],
  data: t.WebRtcInfoData,
  info?: t.WebRtcInfo,
  events?: t.WebRtcEvents,
): t.PropListItem[] {
  const peer = info?.peer;
  const state = info?.state;

  if (!state || !peer) {
    return [];
  }

  const group = data.group;
  const network = state.current.network;
  const local = Object.values(network.peers).find((e) => e.id === peer.id);
  const remotes = Object.values(network.peers)
    .filter((e) => e.id !== peer.id)
    .filter(Boolean);
  if (!local) return [];

  const render = (data: t.NetworkStatePeer, options: { isSelf?: boolean } = {}): t.PropListItem => {
    const { isSelf } = options;
    const isSelected = group?.selected === data.id;

    const value = (
      <PeerRow
        peerid={data.id}
        events={events}
        isSelf={isSelf}
        isSelected={isSelected}
        useController={group?.useController}
        style={{ marginLeft: 5 }}
        onSelect={group?.onPeerSelect}
        onCtrlClick={group?.onPeerCtrlClick}
      />
    );
    return { value };
  };

  const items: t.PropListItem[] = [render(local, { isSelf: true })];
  remotes.forEach((data) => items.push(render(data)));
  return items;
}

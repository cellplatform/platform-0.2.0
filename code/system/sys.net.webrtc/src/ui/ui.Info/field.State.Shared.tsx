import { t, Value, Icons, COLORS, Color, Crdt } from './common';

export function FieldStateShared(
  fields: t.WebRtcInfoField[],
  data: t.WebRtcInfoData,
  info?: t.WebRtcInfo,
): t.PropListItem {
  const self = data.self;
  const peer = self?.peer;
  const shared = data.state?.shared ?? {};
  const label = shared.title ?? 'Shared State';
  const doc = info?.state;

  if (!doc) {
    return {
      label,
      value: { data: '-', opacity: 0.3 },
    };
  }

  return {
    label,
    value: {
      data: <Icons.Network.Docs size={15} color={Color.alpha(COLORS.DARK, 0.6)} />,
      onClick(e) {
        console.info('shared/state.network', Crdt.toObject(doc.current.network));
      },
    },
  };
}

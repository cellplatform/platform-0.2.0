import { t, TestRunner, DEFAULTS, Value } from './common';

export function FieldSelf(data: t.WebRtcInfoData): t.PropListItem {
  const self = data.self;
  const label = self?.title ?? 'Self';
  const peer = self?.peer;

  if (!peer) {
    return {
      label,
      value: { data: '(not specified)', opacity: 0.3 },
    };
  }


  const item: t.PropListItem = {
    label,
    value: {
      data: `me:${Value.shortenHash(peer.id, [5, 5])}`,
    },
  };

  return item;
}

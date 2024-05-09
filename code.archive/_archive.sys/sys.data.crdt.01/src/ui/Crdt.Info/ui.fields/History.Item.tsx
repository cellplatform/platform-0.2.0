import { COLORS, Icons, PropList, t, Time, Value } from '../common';

export function FieldHistoryItem(
  fields: t.CrdtInfoField[],
  data: t.CrdtInfoData,
): t.PropListItem[] {
  const item = data?.history?.item;
  if (!item) return [];

  const change = item.data.change;
  const hash = change.hash;
  const actor = change.actor;
  const title = item.title ?? 'History Item';

  const res: t.PropListItem[] = [];
  const indent = 15;

  res.push({
    label: title,
    value: <Icons.Commit color={COLORS.DARK} size={15} />,
  });
  res.push({
    label: 'Action',
    value: `${change.ops.length} ${Value.plural(change.ops.length, 'operation', 'operations')}`,
    indent,
  });
  res.push({
    label: 'Actor',
    value: { data: Value.shortenHash(actor, 6), clipboard: hash },
    tooltip: `actor-id: ${change.actor}`,
    indent,
  });
  res.push({
    label: 'Hash',
    value: { data: <PropList.Hash text={hash} />, clipboard: hash },
    tooltip: `commit hash: ${change.hash}`,
    indent,
  });

  if (change.time) {
    const time = Time.day(change.time);
    const elapsed = Time.elapsed(time);
    const month = 'D MMM YYYY';
    const format = elapsed.sec < 60 ? `h:mm:ssa, ${month}` : `h:mma, ${month}`;
    res.push({ label: 'Time', value: time.format(format), indent });
  }

  if (fields.includes('History.Item.Message')) {
    const value = change.message ?? '-';
    res.push({
      label: 'Message',
      value,
      tooltip: value,
      indent,
    });
  }

  return res;
}

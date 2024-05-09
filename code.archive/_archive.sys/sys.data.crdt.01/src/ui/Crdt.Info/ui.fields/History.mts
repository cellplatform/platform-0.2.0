import { t, Value, Time } from '../common';

export function FieldHistory(data: t.CrdtInfoData): t.PropListItem[] {
  const history = data.history?.data;
  if (!history) return [];

  const firstWithTime = history.find((item) => item.change.time);
  const now = Time.now.timestamp;
  const elapsed = firstWithTime ? Time.duration(now - firstWithTime.change.time) : undefined;
  const age = elapsed ? `← genesis (${elapsed.toString()})` : '';

  const res: t.PropListItem[] = [];
  const total = history.length ?? 0;
  const commits = Value.plural(total, 'commit (genesis)', 'commits');

  res.push({
    label: data.history?.title ?? 'History',
    value: `${total.toLocaleString()} ${commits} ${age}`.trim(),
  });

  return res;
}

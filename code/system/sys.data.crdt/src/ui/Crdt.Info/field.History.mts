import { t, Value } from './common';

export function History(data: t.CrdtInfoData): t.PropListItem[] {
  const history = data.history?.data;
  if (!history) return [];

  const res: t.PropListItem[] = [];
  const total = history.length ?? 0;
  const commits = Value.plural(total, 'commit (genesis)', 'commits');

  res.push({
    label: data.history?.title ?? 'History',
    value: `${total.toLocaleString()} ${commits}`,
  });

  return res;
}

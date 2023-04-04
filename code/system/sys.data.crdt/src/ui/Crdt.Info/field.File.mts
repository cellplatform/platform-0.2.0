import { t, Value } from './common';

export function File(data: t.CrdtInfoData): t.PropListItem[] {
  const file = data.file;

  const res: t.PropListItem[] = [];

  res.push({
    label: file?.title ?? 'File',
    value: file?.data ? `(exists)` : `(not saved)`,
  });

  return res;
}

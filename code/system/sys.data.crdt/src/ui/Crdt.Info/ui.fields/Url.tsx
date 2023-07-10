import { t } from '../common';

/**
 * Field: URL link
 */
export function FieldUrl(data: t.CrdtInfoData, info?: {}) {
  const value = data.url?.href;
  if (!value) return;

  const label = data.url?.title ?? 'URL';
  const item: t.PropListItem = { label, value };

  return item;
}

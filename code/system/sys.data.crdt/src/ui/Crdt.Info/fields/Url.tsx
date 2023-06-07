import { t } from '../common';
import { QRCode } from '../ui/QRCode';

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

/**
 * Field: QRCode
 */
export function FieldUrlQRCode(data: t.CrdtInfoData, info?: {}) {
  const href = data.url?.href;
  if (!href) return;

  const value = <QRCode href={href} />;
  const item: t.PropListItem = { value };

  return item;
}

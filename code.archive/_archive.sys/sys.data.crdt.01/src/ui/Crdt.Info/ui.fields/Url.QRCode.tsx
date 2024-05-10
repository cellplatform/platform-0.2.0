import { type t } from '../common';
import { QRCode } from '../ui/QRCode';

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

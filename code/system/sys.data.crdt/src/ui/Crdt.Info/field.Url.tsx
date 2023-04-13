import { Button, t, Value, Wrangle, COLORS, Icons, Path } from './common';
import { DEFAULTS, css } from '../common';
import { Hash } from './ui.Hash';

export function FieldUrl(data: t.CrdtInfoData, info?: {}): t.PropListItem[] {
  const res: t.PropListItem[] = [];

  /**
   * TODO 🐷
   * - URL
   * - QR CODE
   * - Copy to clipboard
   */

  res.push({
    label: 'URL',
    value: '🐷 QR CODE',
  });

  return res;
}

import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';

/**
 * Export
 */
type Fields = { DEFAULT: typeof DEFAULTS };
export const QRCode = FC.decorate<t.QRCodeProps, Fields>(
  View,
  { DEFAULT: DEFAULTS },
  { displayName: DEFAULTS.displayName },
);

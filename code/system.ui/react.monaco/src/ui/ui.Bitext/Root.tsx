import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const Bitext = FC.decorate<t.BitextProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'Bitext' },
);

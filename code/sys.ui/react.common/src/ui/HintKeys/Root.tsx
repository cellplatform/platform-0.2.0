import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';

/**
 * Export
 */
type Fields = { DEFAULTS: typeof DEFAULTS };
export const HintKeys = FC.decorate<t.HintKeysProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: DEFAULTS.displayName.HintKeys },
);

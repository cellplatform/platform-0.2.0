import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';
import { Combo } from './ui.Combo';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Combo: typeof Combo;
};
export const KeyHint = FC.decorate<t.KeyHintProps, Fields>(
  View,
  { DEFAULTS, Combo },
  { displayName: DEFAULTS.displayName.KeyHint },
);

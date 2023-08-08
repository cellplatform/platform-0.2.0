import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';
import { useKeyboard } from './use.Keyboard.mjs';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  sizes: typeof DEFAULTS.sizes;
  useKeyboard: typeof useKeyboard;
};
export const PlayBar = FC.decorate<t.PlayBarProps, Fields>(
  View,
  { DEFAULTS, sizes: DEFAULTS.sizes, useKeyboard },
  { displayName: 'PlayBar' },
);

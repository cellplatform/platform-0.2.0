import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';
import { MonoHash } from './ui.MonoHash';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  MonoHash: typeof MonoHash;
};
export const HistoryGrid = FC.decorate<t.HistoryGridProps, Fields>(
  View,
  { DEFAULTS, MonoHash },
  { displayName: DEFAULTS.displayName },
);

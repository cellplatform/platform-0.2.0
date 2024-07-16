import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';

/**
 * Export
 */
type Fields = { DEFAULTS: typeof DEFAULTS };
export const HistoryGrid = FC.decorate<t.HistoryGridProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: DEFAULTS.displayName },
);

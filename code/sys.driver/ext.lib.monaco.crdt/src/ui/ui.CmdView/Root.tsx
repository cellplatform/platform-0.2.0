import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';

/**
 * Export
 */
type Fields = { DEFAULTS: typeof DEFAULTS };
export const CmdView = FC.decorate<t.CmdViewProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: DEFAULTS.displayName },
);

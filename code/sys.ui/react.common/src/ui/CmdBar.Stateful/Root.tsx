import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';

/**
 * Export
 */
type Fields = { DEFAULTS: typeof DEFAULTS };
export const CmdBarStateful = FC.decorate<t.CmdBarStatefulProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: DEFAULTS.displayName },
);

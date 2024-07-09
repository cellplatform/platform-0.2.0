import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';

/**
 * Export
 */
type Fields = {};
export const CmdBarStateful = FC.decorate<t.CmdBarStatefulProps, Fields>(
  View,
  {},
  { displayName: DEFAULTS.displayName },
);

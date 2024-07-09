import { DEFAULTS, FC, Path, TextboxSync as Sync, type t } from './common';
import { View } from './ui';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Sync: typeof Sync;
  Path: typeof Path;
};
export const CmdBarStateful = FC.decorate<t.CmdBarStatefulProps, Fields>(
  View,
  { DEFAULTS, Sync, Path },
  { displayName: DEFAULTS.displayName },
);

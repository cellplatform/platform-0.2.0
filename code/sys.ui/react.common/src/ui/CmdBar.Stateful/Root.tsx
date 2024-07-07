import { DEFAULTS, FC, TextboxSync as Sync, type t } from './common';
import { prepend } from './u';
import { View } from './ui';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Sync: typeof Sync;
  prepend: typeof prepend;
};
export const CmdBarStateful = FC.decorate<t.CmdBarStatefulProps, Fields>(
  View,
  { DEFAULTS, Sync, prepend },
  { displayName: DEFAULTS.displayName },
);

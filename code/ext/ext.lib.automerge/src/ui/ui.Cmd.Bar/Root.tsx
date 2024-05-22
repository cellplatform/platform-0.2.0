import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';
import { Path } from './u';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Path: typeof Path;
};
export const CmdBar = FC.decorate<t.CmdBarProps, Fields>(
  View,
  { DEFAULTS, Path },
  { displayName: DEFAULTS.displayName },
);

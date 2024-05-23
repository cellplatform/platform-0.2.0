import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';
import { Path, Events } from './u';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Path: typeof Path;
  Events: typeof Events;
};
export const CmdBar = FC.decorate<t.CmdBarProps, Fields>(
  View,
  { DEFAULTS, Path, Events },
  { displayName: DEFAULTS.displayName },
);

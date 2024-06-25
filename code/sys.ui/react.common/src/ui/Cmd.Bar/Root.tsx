import { control } from './Root.cmd';
import { DEFAULTS, FC, type t } from './common';
import { Args } from './u';
import { View } from './ui';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  control: typeof control;
  Args: typeof Args;
};
export const CmdBar = FC.decorate<t.CmdBarProps, Fields>(
  View,
  { DEFAULTS, control, Args },
  { displayName: DEFAULTS.displayName },
);

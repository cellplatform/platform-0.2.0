import { control } from './Root.cmd';
import { Args, DEFAULTS, FC, type t } from './common';
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

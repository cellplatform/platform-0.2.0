import { Ctrl } from './Root.ctrl';
import { Args, DEFAULTS, FC, type t } from './common';
import { View } from './ui';
import { Is } from './u';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Args: typeof Args;
  Ctrl: typeof Ctrl;
  Is: typeof Is;
};
export const CmdBar = FC.decorate<t.CmdBarProps, Fields>(
  View,
  { DEFAULTS, Args, Ctrl, Is },
  { displayName: DEFAULTS.displayName },
);

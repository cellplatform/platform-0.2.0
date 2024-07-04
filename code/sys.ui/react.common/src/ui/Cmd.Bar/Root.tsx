import { View as Stateful } from '../CmdBar.Stateful/ui';
import { Ctrl } from './Root.ctrl';
import { Args, DEFAULTS, FC, type t } from './common';
import { Is } from './u';
import { View } from './ui';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Args: typeof Args;
  Ctrl: typeof Ctrl;
  Is: typeof Is;
  Stateful: typeof Stateful;
};
export const CmdBar = FC.decorate<t.CmdBarProps, Fields>(
  View,
  { DEFAULTS, Args, Ctrl, Is, Stateful },
  { displayName: DEFAULTS.displayName },
);

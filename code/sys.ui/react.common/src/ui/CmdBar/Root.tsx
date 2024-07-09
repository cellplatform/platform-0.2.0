import { CmdBarStateful as Stateful } from '../CmdBar.Stateful';
import { Dev } from './-ui.dev';
import { Args, DEFAULTS, FC, type t } from './common';
import { Ctrl } from '../CmdBar.Ctrl';
import { Is, Path } from './u';
import { View } from './ui';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Args: typeof Args;
  Ctrl: typeof Ctrl;
  Is: typeof Is;
  Path: typeof Path;
  Stateful: typeof Stateful;
  Dev: typeof Dev;
};
export const CmdBar = FC.decorate<t.CmdBarProps, Fields>(
  View,
  { DEFAULTS, Args, Ctrl, Is, Path, Stateful, Dev },
  { displayName: DEFAULTS.displayName },
);

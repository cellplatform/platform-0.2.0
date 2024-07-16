import { Ctrl, Is, Path } from '../CmdBar.Ctrl';
import { Dev } from '../CmdBar.Dev';
import { CmdBarStateful as Stateful } from '../CmdBar.Stateful';
import { Args, DEFAULTS, FC, TextboxSync as Sync, type t } from './common';
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
  Sync: typeof Sync;
  Stateful: typeof Stateful;
  Dev: typeof Dev;
};
export const CmdBar = FC.decorate<t.CmdBarProps, Fields>(
  View,
  { DEFAULTS, Args, Ctrl, Is, Path, Sync, Stateful, Dev },
  { displayName: DEFAULTS.displayName },
);

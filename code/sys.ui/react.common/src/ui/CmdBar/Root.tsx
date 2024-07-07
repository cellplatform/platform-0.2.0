import { CmdBarStateful as Stateful } from '../CmdBar.Stateful';
import { Args, DEFAULTS, FC, type t } from './common';
import { Ctrl } from './ctrl';
import { Is } from './u';
import { View } from './ui';
import { Dev } from './-ui.dev';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Args: typeof Args;
  Ctrl: typeof Ctrl;
  Is: typeof Is;
  Stateful: typeof Stateful;
  Dev: typeof Dev;
};
export const CmdBar = FC.decorate<t.CmdBarProps, Fields>(
  View,
  { DEFAULTS, Args, Ctrl, Is, Stateful, Dev },
  { displayName: DEFAULTS.displayName },
);

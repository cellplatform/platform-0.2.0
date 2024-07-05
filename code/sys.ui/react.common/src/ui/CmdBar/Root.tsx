import { CmdBarStateful as Stateful } from '../CmdBar.Stateful';
import { Sample } from './-ui.Sample';
import { Args, DEFAULTS, FC, type t } from './common';
import { Ctrl } from './ctrl';
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
  Sample: typeof Sample;
};
export const CmdBar = FC.decorate<t.CmdBarProps, Fields>(
  View,
  { DEFAULTS, Args, Ctrl, Is, Stateful, Sample },
  { displayName: DEFAULTS.displayName },
);

import { Args, BaseComponent, DEFAULTS, FC, type t } from './common';
import { Events, Path } from './u';
import { View } from './ui';

const events = Events.create;
const cmd = Events.cmd;
const control = BaseComponent.control;

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Args: typeof Args;
  Path: typeof Path;
  Events: typeof Events;
  events: typeof events;
  cmd: typeof cmd;
  control: typeof control;
};
export const CmdBar = FC.decorate<t.CmdBarProps, Fields>(
  View,
  { DEFAULTS, Args, Path, Events, events, cmd, control },
  { displayName: DEFAULTS.displayName },
);

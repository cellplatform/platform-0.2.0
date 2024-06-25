import { DEFAULTS, FC, type t, BaseComponent } from './common';
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
  Path: typeof Path;
  Events: typeof Events;
  events: typeof events;
  cmd: typeof cmd;
  control: typeof control;
};
export const CmdBar = FC.decorate<t.CmdBarProps, Fields>(
  View,
  { DEFAULTS, Path, Events, events, cmd, control },
  { displayName: DEFAULTS.displayName },
);

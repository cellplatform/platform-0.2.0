import { DEFAULTS, FC, type t } from './common';
import { Events, Path } from './u';
import { View } from './ui';

const events = Events.create;
const cmd = Events.cmd;

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Path: typeof Path;
  Events: typeof Events;
  events: typeof events;
  cmd: typeof cmd;
};
export const CmdBar = FC.decorate<t.CmdBarProps, Fields>(
  View,
  { DEFAULTS, Path, Events, events, cmd },
  { displayName: DEFAULTS.displayName },
);

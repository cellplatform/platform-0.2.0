import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';
import { CmdHostPath as Path } from './u';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Path: typeof Path;
};
export const NetworkCmdHost = FC.decorate<t.NetworkCmdHost, Fields>(
  View,
  { DEFAULTS, Path },
  { displayName: DEFAULTS.displayName },
);

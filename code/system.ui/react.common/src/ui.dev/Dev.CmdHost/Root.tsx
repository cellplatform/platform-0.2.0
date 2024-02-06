import { CmdHostStateful as Stateful } from '../Dev.CmdHost.Stateful';
import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Stateful: typeof Stateful;
};
export const CmdHost = FC.decorate<t.CmdHostProps, Fields>(
  View,
  { DEFAULTS, Stateful },
  { displayName: 'CmdHost' },
);

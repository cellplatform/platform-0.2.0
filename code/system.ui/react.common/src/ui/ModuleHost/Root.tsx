import { ModuleHostStateful as Stateful } from '../ModuleHost.Stateful';
import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Stateful: typeof Stateful;
};
export const ModuleHost = FC.decorate<t.ModuleHostProps, Fields>(
  View,
  { DEFAULTS, Stateful },
  { displayName: 'ModuleHost' },
);

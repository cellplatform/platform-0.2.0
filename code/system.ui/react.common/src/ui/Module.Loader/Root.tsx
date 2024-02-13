import { DEFAULTS, FC, type t } from './common';
import { Wrangle } from './u.Wrangle';
import { View } from './ui';
import { Stateful } from './ui.Stateful';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Stateful: typeof Stateful;
  Wrangle: typeof Wrangle;
};
export const ModuleLoader = FC.decorate<t.ModuleLoaderProps, Fields>(
  View,
  { DEFAULTS, Stateful, Wrangle },
  { displayName: DEFAULTS.displayName },
);

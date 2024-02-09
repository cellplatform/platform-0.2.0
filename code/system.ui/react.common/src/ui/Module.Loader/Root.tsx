import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';
import { Wrangle } from './u.Wrangle';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Wrangle: typeof Wrangle;
};
export const ModuleLoader = FC.decorate<t.ModuleLoaderProps, Fields>(
  View,
  { DEFAULTS, Wrangle },
  { displayName: DEFAULTS.displayName },
);

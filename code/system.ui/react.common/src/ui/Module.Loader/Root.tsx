import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const ModuleLoader = FC.decorate<t.ModuleLoaderProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: DEFAULTS.displayName },
);

import { DEFAULTS, FC, type t } from './common';
import { factory } from './Root.factory';
import { View } from './ui';
import { Stateful } from './ui.Stateful';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Stateful: typeof Stateful;
  factory: typeof factory;
};
export const ModuleLoader = FC.decorate<t.ModuleLoaderProps, Fields>(
  View,
  { DEFAULTS, Stateful, factory },
  { displayName: DEFAULTS.displayName },
);

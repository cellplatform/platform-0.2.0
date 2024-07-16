import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';
import { Main } from './ui.Main';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Main: typeof Main;
};

export const Dev = FC.decorate<t.CmdBarDevProps, Fields>(
  View,
  { DEFAULTS, Main },
  { displayName: DEFAULTS.displayName },
);

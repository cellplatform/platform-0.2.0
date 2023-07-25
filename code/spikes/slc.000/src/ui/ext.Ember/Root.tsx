import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';
import { Stateful } from './Root.Stateful';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Stateful: typeof Stateful;
};
export const Root = FC.decorate<t.RootProps, Fields>(
  //
  View,
  { DEFAULTS, Stateful },
  { displayName: 'Root' },
);

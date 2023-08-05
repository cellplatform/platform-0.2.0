import { DEFAULTS, FC, type t } from './common';

import { Stateful } from './Root.Stateful';
import { View } from './ui';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Stateful: typeof Stateful;
};
export const Layout = FC.decorate<t.LayoutProps, Fields>(
  //
  View,
  { DEFAULTS, Stateful },
  { displayName: 'Concept.Layout' },
);

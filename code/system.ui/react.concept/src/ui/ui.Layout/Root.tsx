import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const Layout = FC.decorate<t.LayoutProps, Fields>(
  //
  View,
  { DEFAULTS },
  { displayName: 'Concept.Layout' },
);

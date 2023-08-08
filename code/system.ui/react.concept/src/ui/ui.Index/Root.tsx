import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';
/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const Index = FC.decorate<t.IndexProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'Concept.Index' },
);

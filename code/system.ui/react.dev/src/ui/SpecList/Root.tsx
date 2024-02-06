import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const SpecList = FC.decorate<t.SpecListProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'SpecList' },
);

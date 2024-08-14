import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';
import { FieldSelector } from './ui.FieldSelector';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  FieldSelector: typeof FieldSelector;
};
export const Info = FC.decorate<t.InfoProps, Fields>(
  View,
  { DEFAULTS, FieldSelector },
  { displayName: DEFAULTS.displayName },
);

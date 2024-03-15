import { DEFAULTS, FC, type t } from './common';
import { InfoField } from './field';
import { View } from './ui';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Field: typeof InfoField;
};
export const Info = FC.decorate<t.InfoProps, Fields>(
  View,
  { DEFAULTS, Field: InfoField },
  { displayName: 'Info' },
);

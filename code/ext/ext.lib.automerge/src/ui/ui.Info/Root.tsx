import { DEFAULTS, FC, type t } from './common';
import { Field } from './field';
import { View } from './ui';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Field: typeof Field;
};
export const Info = FC.decorate<t.InfoProps, Fields>(
  View,
  { DEFAULTS, Field },
  { displayName: 'Info' },
);

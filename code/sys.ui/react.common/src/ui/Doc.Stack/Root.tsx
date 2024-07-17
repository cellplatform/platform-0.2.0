import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';

/**
 * Export
 */
type Fields = { DEFAULTS: typeof DEFAULTS };
export const DocStack = FC.decorate<t.DocStack, Fields>(
  View,
  { DEFAULTS },
  { displayName: DEFAULTS.displayName },
);

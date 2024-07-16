import { DEFAULTS, FC, type t } from './common';
import { Field } from './field';
import { Diff } from './u';
import { View } from './ui';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Field: typeof Field;
  Diff: typeof Diff;
};
export const Info = FC.decorate<t.InfoProps, Fields>(
  View,
  { DEFAULTS, Field, Diff },
  { displayName: DEFAULTS.displayName },
);

import { DEFAULTS, FC, type t } from './common';
import { Field } from './field';
import { Diff } from './u';
import { View } from './ui';
import { FieldSelector } from './ui.FieldSelector';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Field: typeof Field;
  Diff: typeof Diff;
  FieldSelector: typeof FieldSelector;
};
export const Info = FC.decorate<t.InfoProps, Fields>(
  View,
  { DEFAULTS, Field, Diff, FieldSelector },
  { displayName: DEFAULTS.displayName },
);

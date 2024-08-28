import { DEFAULTS, FC, type t } from './common';
import { Field } from './field';
import { Diff } from './u';
import { View } from './ui';
import { FieldSelector } from './ui.FieldSelector';
import { Stateful } from './ui.Stateful';
import { useStateful } from './use.Stateful';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Field: typeof Field;
  Diff: typeof Diff;
  FieldSelector: typeof FieldSelector;
  Stateful: typeof Stateful;
  useStateful: typeof useStateful;
};
export const Info = FC.decorate<t.InfoProps, Fields>(
  View,
  { DEFAULTS, Field, Diff, FieldSelector, Stateful, useStateful },
  { displayName: DEFAULTS.displayName },
);

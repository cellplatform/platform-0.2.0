import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';
import { FieldSelector } from './ui.FieldSelector';
import { Stateful } from './ui.Stateful';
import { useStateful } from './use.Stateful';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  FieldSelector: typeof FieldSelector;
  Stateful: typeof Stateful;
  useStateful: typeof useStateful;
};
export const Info = FC.decorate<t.InfoProps, Fields>(
  View,
  { DEFAULTS, FieldSelector, Stateful, useStateful },
  { displayName: DEFAULTS.displayName },
);

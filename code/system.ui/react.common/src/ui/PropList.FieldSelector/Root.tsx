import { FieldBuilder } from '../PropList/FieldBuilder';
import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  FieldBuilder: typeof FieldBuilder;
};
export const FieldSelector = FC.decorate<t.PropListFieldSelectorProps, Fields>(
  View,
  { DEFAULTS, FieldBuilder },
  { displayName: 'PropList.FieldSelector' },
);

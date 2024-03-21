import { DEFAULTS, FC, type t } from './common';
import { Field } from './field';
import { View } from './ui';
import { useRedraw } from './use.Redraw';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Field: typeof Field;
  useRedraw: typeof useRedraw;
};
export const Info = FC.decorate<t.InfoProps, Fields>(
  View,
  { DEFAULTS, Field, useRedraw },
  { displayName: 'Info' },
);

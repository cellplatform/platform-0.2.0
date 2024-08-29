import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';
import { Stateful } from './Root.Stateful';
import { useRedraw } from './use.Redraw';
import { useStateful } from './use.Stateful';
import { FieldSelector } from './ui.FieldSelector';

type Fields = {
  DEFAULTS: typeof DEFAULTS;
  useRedraw: typeof useRedraw;
  FieldSelector: typeof FieldSelector;
  Stateful: typeof Stateful;
  useStateful: typeof useStateful;
};
export const Info = FC.decorate<t.InfoProps, Fields>(
  View,
  { DEFAULTS, useRedraw, FieldSelector, Stateful, useStateful },
  { displayName: DEFAULTS.displayName },
);

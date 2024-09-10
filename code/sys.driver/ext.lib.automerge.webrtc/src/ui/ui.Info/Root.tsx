import { DEFAULTS, FC, type t } from './common';
import { Stateful } from './Root.Stateful';
import { Shared } from './u';
import { View } from './ui';
import { FieldSelector } from './ui.FieldSelector';
import { useRedraw } from './use.Redraw';
import { useStateful } from './use.Stateful';

type Fields = {
  DEFAULTS: typeof DEFAULTS;
  useRedraw: typeof useRedraw;
  FieldSelector: typeof FieldSelector;
  Shared: typeof Shared;
  Stateful: typeof Stateful;
  useStateful: typeof useStateful;
};
export const Info = FC.decorate<t.InfoProps, Fields>(
  View,
  { DEFAULTS, useRedraw, FieldSelector, Shared, Stateful, useStateful },
  { displayName: DEFAULTS.displayName },
);

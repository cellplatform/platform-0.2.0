import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';

const { formatter } = DEFAULTS;

type Fields = {
  DEFAULTS: typeof DEFAULTS;
  formatter: typeof formatter;
};
export const ObjectView = FC.decorate<t.ObjectViewProps, Fields>(
  View,
  { DEFAULTS, formatter },
  { displayName: DEFAULTS.displayName },
);

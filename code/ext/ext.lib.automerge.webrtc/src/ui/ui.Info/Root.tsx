import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';
import { useRedraw } from './use.Redraw';

type Fields = {
  DEFAULTS: typeof DEFAULTS;
  useRedraw: typeof useRedraw;
};
export const Info = FC.decorate<t.InfoProps, Fields>(
  View,
  { DEFAULTS, useRedraw },
  { displayName: 'Info' },
);

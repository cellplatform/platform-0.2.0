import { DEFAULTS, FC, type t } from './common';
import { View } from './ui.Button';

type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const Button = FC.decorate<t.ButtonProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'Button' },
);

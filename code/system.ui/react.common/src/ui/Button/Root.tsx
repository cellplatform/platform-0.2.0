import { DEFAULTS, FC, type t } from './common';
import { View } from './ui.Button';
import { CopyButton as Copy } from './ui.Button.Copy';

type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Copy: typeof Copy;
};
export const Button = FC.decorate<t.ButtonProps, Fields>(
  View,
  { DEFAULTS, Copy },
  { displayName: 'Button' },
);

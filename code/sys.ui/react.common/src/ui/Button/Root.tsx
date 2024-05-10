import { DEFAULTS, FC, type t } from './common';
import { Blue } from './Root.Blue';
import { View } from './ui.Button';
import { CopyButton as Copy } from './ui.Button.Copy';

type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Blue: typeof Blue;
  Copy: typeof Copy;
};
export const Button = FC.decorate<t.ButtonProps, Fields>(
  View,
  { DEFAULTS, Copy, Blue },
  { displayName: 'Button' },
);

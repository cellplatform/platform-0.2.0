import { type t, COLORS } from '../common';

const systemFont = {
  weights: { thin: 100, light: 300, normal: 400, bold: 900 },
  monospace: { family: 'monospace' },
  sans: { family: 'sans-serif' },
} as const;

const focusActions: t.TextInputFocusProps['focusAction'][] = [
  'Select',
  'Cursor:Start',
  'Cursor:End',
];

const valueStyle: t.TextInputStyle = {
  opacity: 1,
  color: COLORS.DARK,
  disabledColor: COLORS.DARK,
  italic: false,
  fontSize: 16,
  fontWeight: undefined,
  fontFamily: undefined,
  letterSpacing: undefined,
  lineHeight: undefined,
};

const prop = {
  isEnabled: true,
  isReadOnly: false,
  isPassword: false,
  autoCapitalize: false,
  autoComplete: false,
  autoCorrect: false,
  autoSize: false,
  spellCheck: false,
  focusOnLoad: false,
  placeholderStyle: { italic: true, opacity: 0.3 },
  disabledOpacity: 0.2,
  valueStyle,
} as const;

export const DEFAULTS = {
  prop,
  focusActions,
  systemFont,
} as const;

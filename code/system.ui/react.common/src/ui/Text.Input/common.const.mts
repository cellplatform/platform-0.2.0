import { t, COLORS } from '../common';

/**
 * [CONSTANTS]
 */
export const SYSTEM_FONT = {
  weights: { thin: 100, light: 300, normal: 400, bold: 900 },
  monospace: { family: 'monospace' },
  sans: { family: 'sans-serif' },
} as const;

/**
 * [Defaults]
 */

const TEXT_STYLE: t.TextInputStyle = {
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

const props: t.TextInputProps = {
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
};

export const DEFAULTS = {
  text: { style: TEXT_STYLE },
  disabledOpacity: 0.2,
  props,
};

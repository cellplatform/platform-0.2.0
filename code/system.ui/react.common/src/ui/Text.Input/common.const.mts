import { t, COLORS } from '../common';

/**
 * [CONSTANTS]
 */
export const monospace = { FAMILY: 'monospace' } as const;
export const sans = { FAMILY: 'sans-serif' } as const;
export const SYSTEM_FONT = {
  weights: { thin: 100, light: 300, normal: 400, bold: 900 },
  monospace,
  sans,
} as const;

/**
 * [Defaults]
 */

const TEXT_STYLE: t.TextInputStyle = {
  opacity: 1,
  color: COLORS.DARK,
  disabledColor: COLORS.DARK,
  italic: false,
  fontSize: undefined,
  fontWeight: undefined,
  fontFamily: undefined,
  letterSpacing: undefined,
  lineHeight: undefined,
};

export const DEFAULTS = {
  text: { style: TEXT_STYLE },
  disabledOpacity: 0.2,
};

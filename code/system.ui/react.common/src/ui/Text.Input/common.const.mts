import { t, COLORS } from '../common';

/**
 * [CONSTANTS]
 */
export const MONOSPACE = { FAMILY: 'monospace' } as const;
export const SANS = { FAMILY: 'sans-serif' } as const;
export const SYSTEM_FONT = {
  WEIGHTS: { thin: 100, light: 300, normal: 400, bold: 900 },
  MONOSPACE,
  SANS,
} as const;

/**
 * [Defaults]
 */

export const TEXT_STYLE: t.TextInputStyle = {
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

export const DEFAULT = {
  TEXT: { STYLE: TEXT_STYLE },
  DISABLED_OPACITY: 0.2,
};

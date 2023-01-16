import { t, COLORS, Color } from '../../common';

/**
 * Colors
 */
const LIGHT: t.TextSyntaxColors = {
  Brace: COLORS.MAGENTA,
  Predicate: COLORS.MAGENTA,
  Colon: Color.alpha(COLORS.DARK, 0.9),
  Word: { Base: COLORS.DARK, Element: COLORS.CYAN },
};
const DARK: t.TextSyntaxColors = {
  Brace: Color.lighten(COLORS.MAGENTA, 10),
  Predicate: Color.lighten(COLORS.MAGENTA, 10),
  Colon: Color.alpha(COLORS.WHITE, 0.8),
  Word: { Base: COLORS.WHITE, Element: COLORS.CYAN },
};

export const THEMES: t.CommonTheme[] = ['Light', 'Dark'];
export const THEME: t.CommonTheme = 'Light';

/**
 * Constants
 */
export const DEFAULT = { THEME, LIGHT, DARK } as const;

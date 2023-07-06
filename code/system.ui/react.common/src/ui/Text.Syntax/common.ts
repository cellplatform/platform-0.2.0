import { COLORS, Color, type t } from '../../common';

export * from '../../common';

export const THEMES: t.CommonTheme[] = ['Light', 'Dark'];
export const THEME: t.CommonTheme = 'Light';
export const DEFAULT = {
  THEME,

  get LIGHT(): t.TextSyntaxColors {
    return {
      Brace: COLORS.MAGENTA,
      Predicate: COLORS.MAGENTA,
      Colon: Color.alpha(COLORS.DARK, 0.9),
      Word: { Base: COLORS.DARK, Element: COLORS.CYAN },
    };
  },

  get DARK(): t.TextSyntaxColors {
    return {
      Brace: Color.lighten(COLORS.MAGENTA, 10),
      Predicate: Color.lighten(COLORS.MAGENTA, 10),
      Colon: Color.alpha(COLORS.WHITE, 0.8),
      Word: { Base: COLORS.WHITE, Element: COLORS.CYAN },
    };
  },
} as const;

import { Pkg, COLORS, Color, type t } from '../common';

export * from '../common';

// export const THEMES: t.CommonTheme[] = ['Light', 'Dark'];
const theme: t.CommonTheme = 'Light';

export const DEFAULTS = {
  displayName: `${Pkg.name}:TextSyntax`,
  theme: {
    default: 'Light',
    get light(): t.TextSyntaxColors {
      return {
        Brace: COLORS.MAGENTA,
        Predicate: COLORS.MAGENTA,
        Colon: Color.alpha(COLORS.DARK, 0.9),
        Word: { Base: COLORS.DARK, Element: COLORS.CYAN },
      };
    },

    get dark(): t.TextSyntaxColors {
      return {
        Brace: Color.lighten(COLORS.MAGENTA, 10),
        Predicate: Color.lighten(COLORS.MAGENTA, 10),
        Colon: Color.alpha(COLORS.WHITE, 0.8),
        Word: { Base: COLORS.WHITE, Element: COLORS.CYAN },
      };
    },
  },
} as const;

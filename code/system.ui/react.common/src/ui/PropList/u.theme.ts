import { Color, COLORS, DEFAULTS, type t } from './common';

export function theme(input?: t.CommonTheme) {
  const value = input ?? DEFAULTS.theme;

  const is = {
    light: value === 'Light',
    dark: value === 'Dark',
  };

  const theme = {
    value,
    is,
    color: {
      base: is.light ? COLORS.DARK : COLORS.WHITE,
      alpha: (opacity: number) => Color.alpha(theme.color.base, opacity),
    },
  };

  return theme;
}

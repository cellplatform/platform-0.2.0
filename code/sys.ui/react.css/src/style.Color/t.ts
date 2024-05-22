import type { t } from '../common';

type HexColor = string;

/**
 * Represents a theme that produces basic color sets.
 */
export type ColorTheme = ColorThemeColors & {
  readonly name: t.CommonTheme;
  readonly is: { readonly light: boolean; readonly dark: boolean };
  alpha(percent?: t.Percent): ColorThemeColors;
};

export type ColorThemeColors = {
  readonly bg: HexColor;
  readonly fg: HexColor;
};

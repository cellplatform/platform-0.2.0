import type { t } from '../common';

type HexColor = string;

/**
 * Represents a theme that produces basic color sets.
 */
export type ColorTheme = {
  readonly name: t.CommonTheme;
  readonly fg: HexColor;
  readonly bg: HexColor;
  readonly is: { readonly light: boolean; readonly dark: boolean };
  readonly alpha: ColorThemeAlpha;
};

export type ColorThemeAlpha = {
  fg(percent?: t.Percent): HexColor;
  bg(percent?: t.Percent): HexColor;
};

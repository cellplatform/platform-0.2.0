import type { t } from '../common';
import { DARK, WHITE } from './Color.const';
import { alpha } from './Color.format';

type HexColor = string;
type ColorInput = string | null;
const DEFAULT: t.CommonTheme = 'Light';

/**
 * A theme helper object.
 */
export function theme(
  name: t.CommonTheme = DEFAULT,
  defaultLight?: ColorInput,
  defaultDark?: ColorInput,
): t.ColorTheme {
  const fg = wrangle.color(name, defaultLight, defaultDark);
  const bg = wrangle.color(wrangle.opposite(name), defaultLight, defaultDark);
  return {
    name,
    fg,
    bg,
    is: { light: name === 'Light', dark: name === 'Dark' },
    alpha(percent: t.Percent = 1) {
      let _fg: HexColor;
      let _bg: HexColor;
      return {
        get fg() {
          return _fg || (_fg = alpha(fg, percent));
        },
        get bg() {
          return _bg || (_bg = alpha(bg, percent));
        },
      };
    },
  } as const;
}

/**
 * Helpers
 */
const wrangle = {
  color(theme: t.CommonTheme = DEFAULT, defaultLight?: ColorInput, defaultDark?: ColorInput) {
    const light = defaultLight ?? DARK;
    const dark = defaultDark ?? WHITE;
    return theme === 'Dark' ? dark : light;
  },

  opposite(theme: t.CommonTheme = DEFAULT): t.CommonTheme {
    return theme === 'Dark' ? 'Light' : 'Dark';
  },
} as const;

import type { t } from '../common';
import { DARK, WHITE } from './Color.const';
import { alpha } from './Color.format';

type HexColor = string;
type ColorInput = string | null;
const DEFAULT: t.CommonTheme = 'Light';

/**
 * A color theme helper object.
 */
export function theme(
  input?: t.CommonTheme | t.ColorTheme | null, // NB: loose input.
  defaultLight?: ColorInput,
  defaultDark?: ColorInput,
): t.ColorTheme {
  const create = () => factory(DEFAULT, defaultLight, defaultDark);
  if (input === null || input === undefined) return create();
  return typeof input === 'object' ? input : create();
}

/**
 * Factory
 */
function factory(
  name: t.CommonTheme,
  defaultLight?: ColorInput,
  defaultDark?: ColorInput,
): t.ColorTheme {
  const fg = wrangle.color(name, defaultLight, defaultDark);
  const bg = wrangle.color(wrangle.invert(name), defaultLight, defaultDark);
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
    invert: () => theme(wrangle.invert(name), defaultLight, defaultDark),
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

  invert(theme: t.CommonTheme = DEFAULT): t.CommonTheme {
    return theme === 'Dark' ? 'Light' : 'Dark';
  },
} as const;
